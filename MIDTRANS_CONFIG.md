# Midtrans Configuration

## Environment Variables

Add these to your `.env.local` or Vercel environment variables:

```bash
# Midtrans Configuration
MIDTRANS_IS_PRODUCTION=false  # Set to true for production
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your-client-key-here
MIDTRANS_SERVER_KEY=your-server-key-here

# Base URL (important for webhooks and redirects)
NEXT_PUBLIC_BASE_URL=https://assessment-web.vercel.app  # Update with your production URL
```

## Webhook & Redirect URLs

Configure these URLs in your Midtrans Dashboard → Settings:

### Development Environment:
```
Payment Notification URL: https://assessment-web.vercel.app/api/premium/webhook
Finish Redirect URL: https://assessment-web.vercel.app/premium/assessment/[ORDER_ID]
Unfinish Redirect URL: https://assessment-web.vercel.app/premium/direct
Error Redirect URL: https://assessment-web.vercel.app/premium/wizard
```

### Production Environment (update with your actual domain):
```
Payment Notification URL: https://your-domain.com/api/premium/webhook
Finish Redirect URL: https://your-domain.com/premium/assessment/[ORDER_ID]
Unfinish Redirect URL: https://your-domain.com/premium/direct
Error Redirect URL: https://your-domain.com/premium/wizard
```

## Notes:
1. **[ORDER_ID]** in Finish Redirect URL will be automatically replaced by Midtrans with the actual order ID
2. Webhook endpoint already handles IP whitelisting for security
3. Webhook verifies transaction status using Midtrans SDK
4. Payment status is stored as: UNPAID_MIDTRANS, PAID_DIRECT, CANCELLED, etc.

## Implementation Status:
✅ Webhook endpoint exists: `/api/premium/webhook`
✅ IP whitelist implemented: Midtrans IPs validated
✅ Payment status updates: Database automatically updated
✅ Assessment session management: Sessions created on checkout
✅ Package tier detection: Basic/Reguler/Premium supported

## Security:
⚠️ **Never commit actual Midtrans keys to Git!**
- Use Vercel Environment Variables for production
- Use `.env.local` for development (add to .gitignore)
- Midtrans keys should be kept secret
