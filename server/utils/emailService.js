// Automated Nodemailer Email Service for ATELIER STORE
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create Nodemailer SMTP Transporter
const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, '') : '';

  if (!user || !pass) {
    console.warn('[EMAIL WARNING] SMTP_USER or SMTP_PASS environment variable is missing.');
  }

  return nodemailer.createTransport({
    host: host,
    port: port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user: user,
      pass: pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

const formatLKR = (val) => {
  if (val === null || val === undefined || val === '') return 'Rs. 0';
  if (typeof val === 'number') return `Rs. ${Math.round(val).toLocaleString('en-LK')}`;
  if (typeof val === 'string' && val.includes('Rs')) return val;
  const cleaned = String(val).replace(/[^0-9.]/g, '');
  return `Rs. ${Math.round(parseFloat(cleaned) || 0).toLocaleString('en-LK')}`;
};

// 1. Send Order Placement Confirmation & HTML Tax Invoice Email
export const sendOrderConfirmationEmail = async (order) => {
  try {
    const transporter = createTransporter();
    const recipientEmail = order.patronEmail || order.email;

    if (!recipientEmail || !recipientEmail.includes('@')) {
      console.warn('[EMAIL WARNING] Invalid patron email for order confirmation:', recipientEmail);
      return false;
    }

    const orderIdStr = order.orderId || order._id || order.id || `ATL-${Date.now()}`;
    const itemsList = Array.isArray(order.items) ? order.items : [];

    const itemsHtml = itemsList
      .map((item, idx) => {
        const itemTitle = typeof item === 'string' ? item : item.title || 'Archival Item';
        const itemQty = item.qty || item.quantity || 1;
        const itemPrice = formatLKR(item.price || 0);
        const itemImg = item.img || item.image || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=400&q=80';

        return `
        <tr>
          <td style="padding: 12px 16px; border-bottom: 1px solid #e7e5e4; text-align: left;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <img src="${itemImg}" alt="${itemTitle}" style="width: 44px; height: 50px; object-fit: cover; border-radius: 6px; border: 1px solid #e7e5e4;" />
              <div>
                <div style="font-size: 13px; font-weight: 600; color: #1c1917;">${itemTitle}</div>
                <div style="font-size: 11px; color: #78716c; margin-top: 2px;">SKU: ATL-${String(orderIdStr).slice(-4)}-${idx + 1}</div>
              </div>
            </div>
          </td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #e7e5e4; text-align: center; font-size: 13px; color: #1c1917; font-weight: 600;">x${itemQty}</td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #e7e5e4; text-align: right; font-size: 13px; color: #1c1917; font-weight: 700;">${itemPrice}</td>
        </tr>
      `;
      })
      .join('');

    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Order Confirmation #${orderIdStr}</title>
        </head>
        <body style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; background-color: #f5f5f4; margin: 0; padding: 24px; color: #1c1917;">
          <div style="max-width: 620px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e7e5e4; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
            
            <!-- Header Banner -->
            <div style="background-color: #1c1917; padding: 28px 32px; text-align: left;">
              <div style="font-family: serif; font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: 0.15em;">ATELIER STORE</div>
              <div style="font-size: 10px; text-transform: uppercase; color: #c27803; letter-spacing: 0.2em; margin-top: 4px; font-weight: 700;">Official Customer Receipt & Order Confirmation</div>
            </div>

            <!-- Content Area -->
            <div style="padding: 32px;">
              <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #1c1917; padding-bottom: 16px; margin-bottom: 24px;">
                <div>
                  <div style="font-size: 11px; text-transform: uppercase; color: #78716c; font-weight: 600;">Billed Customer Account:</div>
                  <div style="font-size: 16px; font-weight: 700; color: #1c1917; margin-top: 2px;">${order.patronName || 'Archival Collector'}</div>
                  <div style="font-size: 12px; color: #44403c;">${recipientEmail}</div>
                </div>
                <div style="text-align: right;">
                  <span style="background-color: #c27803; color: #ffffff; padding: 4px 10px; border-radius: 9999px; font-size: 9px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.1em;">CONFIRMED</span>
                  <div style="font-size: 14px; font-weight: 700; color: #1c1917; margin-top: 6px;">Order #${orderIdStr}</div>
                  <div style="font-size: 11px; color: #78716c;">${order.date || new Date().toLocaleDateString('en-US')}</div>
                </div>
              </div>

              <div style="margin-bottom: 24px; font-size: 13px; line-height: 1.6; color: #44403c;">
                Dear <strong>${order.patronName || 'Valued Patron'}</strong>,<br/>
                Thank you for your acquisition. Your bespoke order has been logged into our fulfillment queue and is being carefully crafted for dispatch.
              </div>

              <!-- Order Manifest Table -->
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <thead>
                  <tr style="background-color: #f5f5f4;">
                    <th style="padding: 10px 16px; text-align: left; font-size: 10px; text-transform: uppercase; color: #78716c;">Item Description</th>
                    <th style="padding: 10px 16px; text-align: center; font-size: 10px; text-transform: uppercase; color: #78716c;">Qty</th>
                    <th style="padding: 10px 16px; text-align: right; font-size: 10px; text-transform: uppercase; color: #78716c;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <!-- Total Card -->
              <div style="background-color: #fafaf9; border-radius: 8px; border: 1px solid #e7e5e4; padding: 18px 24px; text-align: right; margin-bottom: 24px;">
                <div style="font-size: 12px; color: #78716c;">Freight & Taxes Included (DDP Prepaid)</div>
                <div style="font-size: 20px; font-weight: 700; color: #1c1917; margin-top: 4px;">Total Settlement: ${formatLKR(order.total)}</div>
              </div>

              <!-- Shipping Destination -->
              <div style="background-color: #f5f5f4; border-radius: 8px; padding: 16px; font-size: 12px; color: #44403c; border-left: 4px solid #c27803;">
                <strong>📍 Destination Address:</strong><br/>
                ${order.destination || 'Primary Address Location'}
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #fafaf9; border-top: 1px solid #e7e5e4; padding: 16px; text-align: center; font-size: 11px; color: #78716c;">
              🔒 Encrypted Transaction • Official Customer Tax Receipt<br/>
              Atelier Store • Artisanal Luxury E-Commerce Platform
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.FROM_EMAIL || `"ATELIER STORE" <${process.env.SMTP_USER || ''}>`,
      to: recipientEmail,
      subject: `✨ Order Confirmation & Receipt #${orderIdStr} — ATELIER STORE`,
      html: htmlTemplate,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL SUCCESS] Order confirmation sent to ${recipientEmail} (Msg ID: ${info.messageId})`);
    return true;
  } catch (err) {
    console.error('[EMAIL ERROR] Failed to send order confirmation email:', err);
    return false;
  }
};

// 2. Send Dispatch & Courier Tracking Code Update Alert Email
export const sendTrackingUpdateEmail = async (order, trackingCodeStr) => {
  try {
    const transporter = createTransporter();
    const recipientEmail = order.patronEmail || order.email;

    if (!recipientEmail || !recipientEmail.includes('@')) {
      console.warn('[EMAIL WARNING] Invalid patron email for tracking update:', recipientEmail);
      return false;
    }

    const orderIdStr = order.orderId || order._id || order.id || `ATL-${Date.now()}`;
    const activeTrackingCode = trackingCodeStr || order.trackingCode || order.trackingNumber || order.trackingNo || 'DOMEX-9982';
    const courierName = order.courier || 'Pronto / Domex Express Courier';

    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Shipping Update #${orderIdStr}</title>
        </head>
        <body style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; background-color: #f5f5f4; margin: 0; padding: 24px; color: #1c1917;">
          <div style="max-width: 620px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e7e5e4; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
            
            <!-- Header Banner -->
            <div style="background-color: #1c1917; padding: 28px 32px; text-align: left;">
              <div style="font-family: serif; font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: 0.15em;">ATELIER STORE</div>
              <div style="font-size: 10px; text-transform: uppercase; color: #c27803; letter-spacing: 0.2em; margin-top: 4px; font-weight: 700;">Global Logistics & Dispatch Alert</div>
            </div>

            <!-- Content Area -->
            <div style="padding: 32px;">
              <div style="margin-bottom: 20px;">
                <span style="background-color: #0284c7; color: #ffffff; padding: 5px 12px; border-radius: 9999px; font-size: 10px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.1em;">DISPATCHED / IN TRANSIT</span>
                <h2 style="font-size: 18px; font-weight: 700; color: #1c1917; margin-top: 10px;">Your Order #${orderIdStr} is on its way!</h2>
              </div>

              <div style="font-size: 13px; line-height: 1.6; color: #44403c; margin-bottom: 24px;">
                Dear <strong>${order.patronName || 'Valued Patron'}</strong>,<br/>
                Great news! Your order has been prepared, inspected, and handed over to our courier partner for final delivery.
              </div>

              <!-- Tracking Details Card -->
              <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
                <div style="font-size: 11px; text-transform: uppercase; color: #0369a1; font-weight: 700; letter-spacing: 0.1em;">COURIER TRACKING NUMBER (AWB):</div>
                <div style="font-family: monospace; font-size: 22px; font-weight: 700; color: #0284c7; margin: 8px 0;">${activeTrackingCode}</div>
                <div style="font-size: 12px; color: #0369a1;">
                  Courier Service: <strong>${courierName}</strong><br/>
                  Estimated Delivery: <strong>2 - 3 Business Days</strong>
                </div>
              </div>

              <!-- Shipping Address -->
              <div style="background-color: #f5f5f4; border-radius: 8px; padding: 16px; font-size: 12px; color: #44403c;">
                <strong>📍 Destination Address:</strong><br/>
                ${order.destination || 'Primary Customer Address'}
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #fafaf9; border-top: 1px solid #e7e5e4; padding: 16px; text-align: center; font-size: 11px; color: #78716c;">
              🔒 Encrypted Transaction • Official Customer Tax Receipt<br/>
              Atelier Store • Artisanal Luxury E-Commerce Platform
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.FROM_EMAIL || `"ATELIER STORE" <${process.env.SMTP_USER || ''}>`,
      to: recipientEmail,
      subject: `🚚 Shipping & Tracking Update for Order #${orderIdStr} — ATELIER STORE`,
      html: htmlTemplate,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL SUCCESS] Tracking alert sent to ${recipientEmail} for AWB: ${activeTrackingCode}`);
    return true;
  } catch (err) {
    console.error('[EMAIL ERROR] Failed to send tracking update email:', err);
    return false;
  }
};
