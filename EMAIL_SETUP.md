# Email Notification Setup

## Current Status

Order notifications are currently logged to the console. To receive actual email notifications, you need to integrate an email service.

## Recommended Options

### Option 1: Resend (Recommended for Vercel)

1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Add to `.env.local`:
   ```
   RESEND_API_KEY=re_czuB3DqR_JRL8xAjuGSrY86TMBGAPKfCe
   ```
4. Install Resend:
   ```bash
   npm install resend
   ```
5. Uncomment the Resend code in `src/app/api/orders/send-email/route.ts`

### Option 2: SendGrid

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create an API key
3. Add to `.env.local`:
   ```
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
   ```
4. Install SendGrid:
   ```bash
   npm install @sendgrid/mail
   ```

### Option 3: Nodemailer with Gmail SMTP

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Add to `.env.local`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=mahajanwinehaven24@gmail.com
   SMTP_PASS=your-app-password
   ```
4. Install Nodemailer:
   ```bash
   npm install nodemailer
   ```

## Email Configuration

The order notification email is sent to: **mahajanwinehaven24@gmail.com**

You can change this in `src/app/api/orders/send-email/route.ts` by updating the `STORE_EMAIL` constant.

## Testing

After setting up an email service, test by:
1. Adding items to cart
2. Going to checkout
3. Submitting an order
4. Check your email inbox for the notification

## Current Behavior

Until an email service is configured, order notifications are:
- Logged to the console (check your server logs)
- Saved to the database (orders table in Supabase)
- Not sent via email


