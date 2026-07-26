# Email Tracking Feature

This feature automatically sends tracking codes and order confirmation emails to customers when they complete checkout.

## Setup Instructions

### 1. Install Dependencies
Dependencies are already installed. The feature uses `nodemailer` to send emails.

### 2. Configure Email Service

Edit your `.env` file (or create one from `.env.example`) with your email provider credentials:

#### Using Gmail:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
PUBLIC_URL=https://your-domain.com
```

**Gmail Setup Steps:**
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Factor Authentication
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Select "Mail" and "Windows Computer" (or your device)
5. Copy the 16-character password and use it as `EMAIL_PASSWORD`

#### Using Other SMTP Services:

```env
EMAIL_HOST=your-smtp-server.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@domain.com
EMAIL_PASSWORD=your-password
EMAIL_FROM=noreply@domain.com
PUBLIC_URL=https://your-domain.com
```

### 3. Files Modified

- **[src/lib/email-service.ts](src/lib/email-service.ts)** - Email sending service
- **[src/routes/api.send-tracking-email.ts](src/routes/api.send-tracking-email.ts)** - API endpoint
- **[src/components/CheckoutModal.tsx](src/components/CheckoutModal.tsx)** - Calls email API after order creation
- **.env.example** - Environment variable template

## How It Works

1. **Checkout**: Customer completes purchase
2. **Order Creation**: Order is stored in localStorage
3. **Email Send**: `sendTrackingEmail()` is called with the order details
4. **API Call**: Fetches `/api/send-tracking-email` endpoint
5. **Email Delivery**: Beautiful HTML email sent to customer with:
   - Order confirmation
   - Tracking number
   - Link to track order status
   - Order summary with items and prices
   - Delivery address

## Email Template

The email includes:
- Company branding
- Order confirmation message
- Tracking number (prominently displayed)
- Direct link to order tracking page
- Itemized order details
- Shipping address
- Contact information

## Troubleshooting

### Emails not sending?

1. **Check environment variables**: Ensure `.env` file has correct email credentials
2. **Gmail 2FA**: Make sure you're using an App Password, not your regular password
3. **Firewall**: Ensure your server can connect to the SMTP server (port 587/465)
4. **Email logs**: Check browser console and server logs for error messages

### Testing Locally

To test without email credentials:
- The app will still work and display order confirmation
- Emails will log a warning but won't crash the app
- Check console for email service status

## Production Deployment

For production:
1. Use a dedicated email service like SendGrid, Mailgun, or AWS SES for better reliability
2. Set proper `PUBLIC_URL` for tracking links in emails
3. Use environment secrets in your deployment platform
4. Monitor email delivery rates and bounces

## Future Enhancements

- SMS tracking notifications
- Multiple email templates (invoice, shipping update, delivery)
- Email preferences/unsubscribe management
- Email delivery status tracking
- Resend or SendGrid integration for higher volume
