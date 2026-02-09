import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto, LoginDto, AuthResponseDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
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
}
