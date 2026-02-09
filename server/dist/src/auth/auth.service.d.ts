import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto, AuthResponseDto } from './dto/auth.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<AuthResponseDto>;
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    validateUser(userId: string): Promise<{
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        isAdmin: boolean;
    } | null>;
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        phone: string | null;
        isAdmin: boolean;
        createdAt: Date;
    } | null>;
    private generateToken;
    getAllUsers(): Promise<{
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        phone: string | null;
        isAdmin: boolean;
        createdAt: Date;
        _count: {
            orders: number;
        };
    }[]>;
    validateGoogleUser(profile: any): Promise<any>;
}
