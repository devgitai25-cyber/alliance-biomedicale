import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { RegisterDto, LoginDto, AuthResponseDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private emailService: EmailService,
    ) { }

    async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
        const { email, password, firstName, lastName, phone } = registerDto;

        // Check if user already exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictException('Email already registered');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                phone,
            },
        });

        // Generate JWT token
        const accessToken = this.generateToken(user.id, user.email, user.isAdmin);

        return {
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName || undefined,
                lastName: user.lastName || undefined,
                isAdmin: user.isAdmin,
            },
        };
    }

    async login(loginDto: LoginDto): Promise<AuthResponseDto> {
        const { email, password } = loginDto;

        // Find user
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Generate JWT token
        const accessToken = this.generateToken(user.id, user.email, user.isAdmin);

        return {
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName || undefined,
                lastName: user.lastName || undefined,
                isAdmin: user.isAdmin,
            },
        };
    }

    async validateUser(userId: string) {
        return await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                isAdmin: true,
            },
        });
    }

    async getProfile(userId: string) {
        return await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                isAdmin: true,
                createdAt: true,
            },
        });
    }

    private generateToken(userId: string, email: string, isAdmin: boolean): string {
        const payload = { sub: userId, email, isAdmin };
        return this.jwtService.sign(payload);
    }

    async getAllUsers() {
        const users = await this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                isAdmin: true,
                createdAt: true,
                _count: {
                    select: {
                        orders: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return users;
    }

    async validateGoogleUser(profile: any): Promise<any> {
        const { id, emails, name, photos } = profile;
        const email = emails[0].value;

        // 1. Check if user exists with googleId
        const existingUser = await this.prisma.user.findUnique({
            where: { googleId: id },
        });

        if (existingUser) {
            const accessToken = this.generateToken(existingUser.id, existingUser.email, existingUser.isAdmin);
            return {
                accessToken,
                user: {
                    id: existingUser.id,
                    email: existingUser.email,
                    firstName: existingUser.firstName,
                    lastName: existingUser.lastName,
                    isAdmin: existingUser.isAdmin,
                }
            };
        }

        // 2. Check if user exists with email (link account)
        const userByEmail = await this.prisma.user.findUnique({
            where: { email },
        });

        if (userByEmail) {
            // Update user with googleId
            const updatedUser = await this.prisma.user.update({
                where: { id: userByEmail.id },
                data: { googleId: id },
            });

            const accessToken = this.generateToken(updatedUser.id, updatedUser.email, updatedUser.isAdmin);
            return {
                accessToken,
                user: {
                    id: updatedUser.id,
                    email: updatedUser.email,
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    isAdmin: updatedUser.isAdmin,
                }
            };
        }

        // 3. Create new user
        const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        const newUser = await this.prisma.user.create({
            data: {
                email,
                googleId: id,
                password: hashedPassword,
                firstName: name?.givenName || '',
                lastName: name?.familyName || '',
            },
        });

        const accessToken = this.generateToken(newUser.id, newUser.email, newUser.isAdmin);
        return {
            accessToken,
            user: {
                id: newUser.id,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                isAdmin: newUser.isAdmin,
            }
        };
    }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto, locale: string = 'fr'): Promise<{ message: string }> {
        const { email } = forgotPasswordDto;

        // Find user by email
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        // Always return success message to prevent email enumeration
        const successMessage = locale === 'ar'
            ? 'إذا كان البريد الإلكتروني موجودًا، فستتلقى رابط إعادة تعيين كلمة المرور.'
            : 'Si cet email existe, vous recevrez un lien de réinitialisation.';

        if (!user) {
            // Don't reveal that user doesn't exist
            return { message: successMessage };
        }

        // Generate secure random token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Hash token before storing
        const hashedToken = await bcrypt.hash(resetToken, 10);

        // Set expiration to 1 hour from now
        const expiresAt = new Date(Date.now() + 3600000); // 1 hour

        // Save hashed token and expiration to database
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: hashedToken,
                resetPasswordExpires: expiresAt,
            },
        });

        // Send email with plain token (only sent once, never stored)
        try {
            await this.emailService.sendPasswordResetEmail(email, resetToken, locale);
        } catch (error) {
            console.error('Failed to send reset email:', error);
            // Don't throw error to prevent revealing email existence
        }

        return { message: successMessage };
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
        const { token, newPassword } = resetPasswordDto;

        // Find all users with non-expired reset tokens
        const users = await this.prisma.user.findMany({
            where: {
                resetPasswordToken: { not: null },
                resetPasswordExpires: { gte: new Date() },
            },
        });

        // Find user with matching token
        let matchedUser: typeof users[0] | null = null;
        for (const user of users) {
            // Skip if resetPasswordToken is null (shouldn't happen due to query, but TypeScript safety)
            if (!user.resetPasswordToken) continue;

            const isValidToken = await bcrypt.compare(token, user.resetPasswordToken);
            if (isValidToken) {
                matchedUser = user;
                break;
            }
        }

        if (!matchedUser) {
            throw new BadRequestException('Token invalide ou expiré');
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear reset fields
        await this.prisma.user.update({
            where: { id: matchedUser.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null,
            },
        });

        return { message: 'Mot de passe réinitialisé avec succès' };
    }
}
