# Resend Email Setup Guide

This guide will help you set up Resend for email functionality in your Wine Haven website. You'll need Resend for:
1. **Click & Collect** - Order confirmation emails
2. **Get in Touch** - Contact form submissions

## Step 1: Create a Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account (100 emails/day free tier)
3. Verify your email address

## Step 2: Get Your API Key

1. Go to [Resend Dashboard](https://resend.com/api-keys)
2. Click "Create API Key"
3. Name it something like "Wine Haven Production"
4. Copy the API key (starts with `re_...`)
5. **Important**: Save this key securely - you won't be able to see it again!

## Step 3: Verify Your Domain (Recommended for Production)

⚠️ **Important: Wix DNS Limitation**

**Wix does NOT support subdomains for MX records.** This means you cannot verify your domain for Resend if your DNS is managed by Wix.

### Options:

**Option A: Use Resend's Test Domain (Quick Start)**
- For testing and development, use `onboarding@resend.dev` as your sender email
- No domain verification needed
- Works immediately

**Option B: Transfer DNS Management (Production)**
- Transfer your domain's DNS management to another provider (Cloudflare, Namecheap, etc.)
- Then verify your domain in Resend
- Add the DNS records Resend provides to your new DNS provider
- Wait for verification (usually a few minutes)

**Option C: Use a Different Domain**
- Use a domain that's not managed by Wix for email
- Verify that domain in Resend

**For now, we'll use Option A (test domain) to get started quickly.**

## Step 4: Add Environment Variables

Add your Resend API key to your `.env.local` file:

```env
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=noreply@winehavendunlaoghaire.com
# Or for testing:
# RESEND_FROM_EMAIL=onboarding@resend.dev
```

## Step 5: Install Resend Package

The package should already be installed, but if not:

```bash
npm install resend
```

## Step 6: Create Email API Routes

You'll need to create two API routes:

### 1. Contact Form Email (`/api/contact/route.ts`)

This will send emails when users submit the contact form.

### 2. Click & Collect Email (`/api/orders/email/route.ts`)

This will send order confirmation emails.

## Step 7: Update Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add:
   - `RESEND_API_KEY` = your Resend API key
   - `RESEND_FROM_EMAIL` = your verified email address

## Testing

1. Test the contact form on your site
2. Check your Resend dashboard for sent emails
3. Verify emails are received correctly

## Next Steps

Once Resend is set up, we'll need to:
1. Create the contact form email API route
2. Create the click & collect order email API route
3. Update the contact form to use the new email API
4. Update the checkout/order process to send confirmation emails

## Troubleshooting

- **Emails not sending?** Check your API key is correct in environment variables
- **Domain not verified?** Use `onboarding@resend.dev` for testing
- **Rate limits?** Free tier allows 100 emails/day, upgrade if needed

## Security Notes

- Never commit your API keys to Git
- Always use environment variables
- Rotate API keys if they're exposed
- Use domain verification for production

