import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<import("./dto/auth.dto").AuthResponseDto>;
    login(loginDto: LoginDto): Promise<import("./dto/auth.dto").AuthResponseDto>;
    googleAuth(req: any): Promise<void>;
    googleAuthRedirect(req: any, res: any): Promise<void>;
    getAllUsers(): Promise<{
        email: string;
        firstName: string | null;
        lastName: string | null;
        phone: string | null;
        id: string;
        isAdmin: boolean;
        createdAt: Date;
        _count: {
            orders: number;
        };
    }[]>;
    getProfile(req: any): Promise<{
        email: string;
        firstName: string | null;
        lastName: string | null;
        phone: string | null;
        id: string;
        isAdmin: boolean;
        createdAt: Date;
    } | null>;
}
