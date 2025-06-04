
# Stripe Setup Guide

To enable payment processing with Stripe, you need to set up the following environment variables in your Replit Secrets:

## Required Environment Variables

1. **STRIPE_SECRET_KEY**
   - Go to https://dashboard.stripe.com/apikeys
   - Copy your "Secret key" (starts with `sk_`)
   - Add it to Replit Secrets as `STRIPE_SECRET_KEY`

2. **STRIPE_WEBHOOK_SECRET**
   - Go to https://dashboard.stripe.com/webhooks
   - Create a new webhook endpoint with URL: `https://your-repl-url.replit.dev/api/webhook/stripe`
   - Select events: `checkout.session.completed`
   - Copy the "Signing secret" (starts with `whsec_`)
   - Add it to Replit Secrets as `STRIPE_WEBHOOK_SECRET`

## How to Add Environment Variables in Replit

1. Open the Secrets tool in your Replit workspace (lock icon in sidebar)
2. Click "Add Secret"
3. Enter the key name and value
4. Click "Add Secret"

## Testing

- Use Stripe test mode for development
- Test with card number: 4242 4242 4242 4242
- Use any future expiry date and any 3-digit CVC

## Production

- Switch to live mode in Stripe dashboard
- Update environment variables with live keys
- Deploy your Replit app

Your payment system will be fully functional once these environment variables are configured!
