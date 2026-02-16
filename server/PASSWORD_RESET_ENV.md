# Password Reset - Environment Variables

Add these environment variables to your `.env` file:

## Required Variables

```env
# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com              # Your SMTP server host
SMTP_PORT=587                          # SMTP port (587 for TLS, 465 for SSL)
SMTP_SECURE=false                      # true for 465, false for other ports
SMTP_USER=your-email@gmail.com         # Your email address
SMTP_PASS=your-app-password            # Your email password or app-specific password
SMTP_FROM=noreply@alliancebiomedicale.com  # From address (can be same as SMTP_USER)

# Frontend URL (for reset links in emails)
FRONTEND_URL=https://your-domain.com   # Your production frontend URL
```

## Email Provider Setup

### Gmail
1. Enable 2-factor authentication on your Google account
2. Generate an app-specific password: https://myaccount.google.com/apppasswords
3. Use the app password as `SMTP_PASS`

### Other Providers
- **SendGrid**: SMTP_HOST=smtp.sendgrid.net, SMTP_PORT=587
- **Mailgun**: SMTP_HOST=smtp.mailgun.org, SMTP_PORT=587
- **AWS SES**: SMTP_HOST=email-smtp.region.amazonaws.com, SMTP_PORT=587

## Docker Deployment

When deploying with Docker, make sure to:
1. Update the `.env` file in your server directory
2. Rebuild the backend Docker image
3. Restart the container for changes to take effect

```bash
# Rebuild backend image
docker build -t bioeco-backend ./server

# Restart container with new environment variables
docker stop bioeco-backend
docker start bioeco-backend
```
