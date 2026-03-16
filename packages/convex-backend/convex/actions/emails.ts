"use node"; // Required for Mailtrap/Node packages
import { v } from "convex/values";
import { internalAction } from "../_generated/server"; // Use internalAction
import { MailtrapClient } from "mailtrap";

export const sendEmail = internalAction({
  args: {
    to: v.string(),
    subject: v.string(),
    orderId: v.id("orders"),
    totalAmount: v.number(),
    items: v.array(
      v.object({
        name: v.string(),
        quantity: v.number(),
        price: v.number(),
        image: v.optional(v.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const client = new MailtrapClient({
      token: process.env.MAILTRAP_TOKEN!,
      // sandbox:true,
      // testInboxId: 4204813, // Remove this line if using Production/Real sending
    });

    // 1. Generate Product Rows with Images
    const itemsHtml = args.items
      .map((item) => {
        // Fallback image if none provided
        // const imgUrl = item.image || "https://placehold.co/100x100?text=No+Image";

        return `
        <tr>
          <td style="padding: 16px 0; border-bottom: 1px solid #e5e7eb;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
             
                <td style="padding-left: 1px; vertical-align: middle;">
                  <span style="display: block; font-size: 14px; font-weight: 600; color: #111827;">${item.name}</span>
                  <span style="display: block; font-size: 12px; color: #6b7280; margin-top: 4px;">Qty: ${item.quantity}</span>
                </td>
                <td style="text-align: right; vertical-align: middle; white-space: nowrap;">
                  <span style="font-size: 14px; font-weight: 600; color: #111827;">₦${item.price.toLocaleString()}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `;
      })
      .join("");

    // 2. Modern HTML Template
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
          /* Reset & Base */
          body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; color: #374151; }
          table { border-spacing: 0; width: 100%; }
          img { border: 0; }
          
          /* Container */
          .wrapper { width: 100%; table-layout: fixed; background-color: #f3f4f6; padding-bottom: 40px; }
          .main-table { margin: 0 auto; max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
          
          /* Header */
          .header-bg { background-color: #16a34a; padding: 30px 20px; text-align: center; }
          .header-title { color: #ffffff; font-size: 24px; font-weight: 700; margin: 0; }
          .header-subtitle { color: #dcfce7; font-size: 14px; margin-top: 8px; }
          
          /* Content */
          .content-padding { padding: 30px; }
          .section-title { font-size: 12px; font-weight: 700; text-transform: uppercase; color: #9ca3af; letter-spacing: 1px; margin-bottom: 10px; }
          
          /* Info Grid */
          .info-table td { padding-bottom: 20px; vertical-align: top; }
          .info-label { font-size: 12px; color: #6b7280; margin-bottom: 4px; display: block; }
          .info-value { font-size: 14px; color: #111827; font-weight: 500; display: block; }
          
          /* Total Section */
          .total-section { background-color: #f9fafb; padding: 20px 30px; border-top: 1px solid #e5e7eb; }
          .total-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
          .total-label { font-size: 14px; color: #6b7280; }
          .total-value { font-size: 14px; color: #111827; font-weight: 600; }
          .grand-total { font-size: 20px; color: #16a34a; font-weight: 800; }
          
          /* Button */
          .btn-container { text-align: center; margin-top: 30px; }
          .btn { background-color: #16a34a; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; display: inline-block; }
          
          /* Footer */
          .footer { text-align: center; padding-top: 20px; font-size: 12px; color: #9ca3af; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <br>
          <table class="main-table">
            
            <!-- Header Banner -->
            <tr>
              <td class="header-bg">
                <div style="font-size: 20px; margin-bottom: 10px; color: #16a34a; font-weight: bold;">✓ Order Confirmed</div>
                <h1 class="header-title">Thanks for your order!</h1>
                <p class="header-subtitle">Order #${args.orderId}</p>
              </td>
            </tr>

            <!-- Order Details Area -->
            <tr>
              <td class="content-padding">
                
                <!-- Info Grid -->
                <table class="info-table" width="100%">
                  <tr>
                    <td width="50%">
                      <span class="info-label">ORDER DATE</span>
                      <span class="info-value">${new Date().toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" })}</span>
                    </td>
                    <td width="50%">
                      <span class="info-label">PAYMENT METHOD</span>
                      <span class="info-value">Online Payment</span>
                    </td>
                  </tr>
                </table>

                <div style="height: 10px;"></div>
                <div class="section-title">ITEMS ORDERED</div>

                <!-- Products List -->
                <table width="100%">
                  ${itemsHtml}
                </table>

                <!-- Action Button -->
                <div class="btn-container">
                  <a href="https://www.wazopets.com/orders" class="btn">Track your Order</a>
                </div>

              </td>
            </tr>

            <!-- Financials / Total -->
            <tr>
              <td class="total-section">
                <table width="100%">
                  <tr>
                    <td style="padding-bottom: 8px; color: #6b7280; font-size: 14px;">Subtotal</td>
                    <td style="padding-bottom: 8px; text-align: right; color: #111827; font-weight: 600; font-size: 14px;">₦${args.totalAmount.toLocaleString()}</td>
                  </tr>
                 
                  <tr style="border-top: 1px solid #e5e7eb;">
                    <td style="padding-top: 12px; font-size: 16px; font-weight: 700; color: #111827;">Total</td>
                    <td style="padding-top: 12px; text-align: right; font-size: 24px; font-weight: 800; color: #16a34a;">₦${args.totalAmount.toLocaleString()}</td>
                  </tr>
                </table>
              </td>
            </tr>

          </table>

          <!-- Footer -->
          <div class="footer">
            <p>WazoPets Nigeria • Lagos & Abuja</p>
          </div>
          <br>
        </div>
      </body>
      </html>
    `;

    // 3. Send via Mailtrap
    try {
      await client.send({
        from: { email: "hello@wazopets.com", name: "WazoPets" },
        to: [{ email: args.to }],
        reply_to: { email: "support@wazopets.com" }, // Add this
        subject: args.subject,
        text: `Thank you for your order #${args.orderId}. Total: ₦${args.totalAmount}`,
        html: fullHtml,
        category: "Order Confirmation",
      });
      console.log("Modern Email sent successfully!");
    } catch (error) {
      console.error("Mailtrap error:", error);
    }
  },
});
