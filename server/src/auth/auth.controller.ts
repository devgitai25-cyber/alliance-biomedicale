import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { JwtAuthGuard, AdminGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    @Throttle({ default: { ttl: 60000, limit: 5 } }) // 5 registrations per minute
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { ttl: 60000, limit: 5 } }) // 5 login attempts per minute
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) { }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res() res) {
        const { accessToken } = req.user;
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        res.redirect(`${frontendUrl}/fr/callback?token=${accessToken}`);
    }

    @Get('users')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async getAllUsers() {
        return this.authService.getAllUsers();
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    async getProfile(@Req() req: any) {
        return this.authService.getProfile(req.user.id);
    }
}
