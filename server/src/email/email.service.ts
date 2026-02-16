import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter: Transporter;
    private readonly logger = new Logger(EmailService.name);

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendPasswordResetEmail(
        email: string,
        resetToken: string,
        locale: string = 'fr'
    ): Promise<void> {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const resetUrl = `${frontendUrl}/${locale}/reset-password?token=${resetToken}`;

        const translations = {
            fr: {
                subject: 'Réinitialisation de votre mot de passe',
                greeting: 'Bonjour,',
                intro: 'Vous avez demandé à réinitialiser votre mot de passe.',
                instruction: 'Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe :',
                button: 'Réinitialiser le mot de passe',
                expiry: 'Ce lien expirera dans 1 heure.',
                ignore: 'Si vous n\'avez pas demandé cette réinitialisation, ignorez simplement cet e-mail.',
                thanks: 'Merci,',
                team: 'L\'équipe Alliance Biomédicale',
            },
            ar: {
                subject: 'إعادة تعيين كلمة المرور الخاصة بك',
                greeting: 'مرحبا،',
                intro: 'لقد طلبت إعادة تعيين كلمة المرور الخاصة بك.',
                instruction: 'انقر على الزر أدناه لإعادة تعيين كلمة المرور الخاصة بك:',
                button: 'إعادة تعيين كلمة المرور',
                expiry: 'ستنتهي صلاحية هذا الرابط خلال ساعة واحدة.',
                ignore: 'إذا لم تطلب إعادة التعيين هذه، فتجاهل هذا البريد الإلكتروني.',
                thanks: 'شكرا لك،',
                team: 'فريق Alliance Biomédicale',
            },
        };

        const t = translations[locale] || translations.fr;

        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            background: #ffffff;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #2c3e50;
        }
        .content {
            margin: 30px 0;
        }
        .button {
            display: inline-block;
            padding: 14px 30px;
            background-color: #3498db;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
        }
        .button:hover {
            background-color: #2980b9;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #666;
        }
        .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 12px;
            margin: 20px 0;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Alliance Biomédicale</div>
        </div>
        <div class="content">
            <p>${t.greeting}</p>
            <p>${t.intro}</p>
            <p>${t.instruction}</p>
            <div style="text-align: center;">
                <a href="${resetUrl}" class="button">${t.button}</a>
            </div>
            <p style="color: #666; font-size: 14px;">Ou copiez ce lien dans votre navigateur :</p>
            <p style="word-break: break-all; color: #3498db; font-size: 14px;">${resetUrl}</p>
            <div class="warning">
                <strong>⏱️ ${t.expiry}</strong>
            </div>
            <p>${t.ignore}</p>
        </div>
        <div class="footer">
            <p>${t.thanks}<br>${t.team}</p>
        </div>
    </div>
</body>
</html>
        `;

        const textContent = `
${t.greeting}

${t.intro}

${t.instruction}

${resetUrl}

${t.expiry}

${t.ignore}

${t.thanks}
${t.team}
        `;

        try {
            await this.transporter.sendMail({
                from: process.env.SMTP_FROM || process.env.SMTP_USER,
                to: email,
                subject: t.subject,
                text: textContent,
                html: htmlContent,
            });

            this.logger.log(`Password reset email sent to ${email}`);
        } catch (error) {
            this.logger.error(`Failed to send email to ${email}:`, error);
            throw new Error('Failed to send email');
        }
    }
}
