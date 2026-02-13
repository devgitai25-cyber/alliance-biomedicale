"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcryptjs");
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const { email, password, firstName, lastName, phone } = registerDto;
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email already registered');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                phone,
            },
        });
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
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
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
    async validateUser(userId) {
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
    async getProfile(userId) {
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
    generateToken(userId, email, isAdmin) {
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
    async validateGoogleUser(profile) {
        const { id, emails, name, photos } = profile;
        const email = emails[0].value;
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
        const userByEmail = await this.prisma.user.findUnique({
            where: { email },
        });
        if (userByEmail) {
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map