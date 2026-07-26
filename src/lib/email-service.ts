import nodemailer from "nodemailer";
import type { Order } from "./order-tracking";

// Configure your email service here
// Using Gmail or any SMTP service
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export type SendTrackingEmailInput = {
  order: Order;
};

export async function sendTrackingEmail({ order }: SendTrackingEmailInput) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn("Email credentials not configured. Skipping email send.");
    return { success: false, message: "Email not configured" };
  }

  try {
    const trackingUrl = `${process.env.PUBLIC_URL || "http://localhost:5173"}/tracking?code=${order.trackingNumber}`;
    const itemsHtml = order.items
      .map((item) => `<tr><td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.title}</td><td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">x${item.qty}</td><td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₦${(item.price * item.qty).toLocaleString()}</td></tr>`)
      .join("");

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; }
            .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
            .tracking-code { background: white; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; font-size: 18px; font-weight: bold; font-family: monospace; }
            .btn { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin-top: 15px; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            .summary { background: white; padding: 15px; border-radius: 4px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Order Confirmed! 🎉</h1>
              <p>Thank you for your purchase from Alphabet Nigerian Publishers</p>
            </div>
            <div class="content">
              <p>Hi ${order.customerName},</p>
              <p>We're excited to let you know that your order has been received and is being prepared for shipment.</p>
              
              <div class="tracking-code">
                Tracking Number: ${order.trackingNumber}
              </div>
              
              <p>Use this tracking number to monitor your order status:</p>
              <a href="${trackingUrl}" class="btn">Track Your Order</a>
              
              <h3 style="margin-top: 30px;">Order Details</h3>
              <table>
                <thead>
                  <tr style="background: #f0f0f0;">
                    <th style="padding: 8px; text-align: left;">Item</th>
                    <th style="padding: 8px; text-align: right;">Qty</th>
                    <th style="padding: 8px; text-align: right;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
              
              <div class="summary">
                <p style="margin: 8px 0;"><strong>Subtotal:</strong> ₦${order.subtotal.toLocaleString()}</p>
                <p style="margin: 8px 0;"><strong>Shipping:</strong> ₦${order.shipping.toLocaleString()}</p>
                <p style="margin: 8px 0; font-size: 18px;"><strong>Total:</strong> ₦${order.total.toLocaleString()}</p>
              </div>
              
              <h3 style="margin-top: 30px;">Delivery Address</h3>
              <p>
                ${order.address}<br>
                ${order.city}, ${order.state} ${order.country}
              </p>
              
              <p style="margin-top: 30px; font-size: 14px; color: #666;">
                If you have any questions, feel free to reach out to our support team. We're here to help!
              </p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Alphabet Nigerian Publishers. All rights reserved.</p>
              <p>Questions? Contact us at support@alphabetpublishers.com</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: order.email,
      subject: `Your Order Confirmation & Tracking Code: ${order.trackingNumber}`,
      html: htmlContent,
    });

    console.log("Email sent successfully:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
