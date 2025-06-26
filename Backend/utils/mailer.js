import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD.replace(/\s+/g, ''),
  },
});

// Verify connection configuration
transporter.verify((error) => {
  if (error) {
    console.error('Mail transporter verification failed:', error);
  } else {
    console.log('Mail server is ready to send messages');
  }
});

export const sendOrderEmail = async (orderData) => {
  try {
    const { user, items, totalAmount, orderId } = orderData;

    const itemDetails = items.map(item => 
      `• ${item.quantity}x ${item.product?.name || 'Item'} - ₹${item.price || '0.00'}`
    ).join('\n');

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.RESTAURANT_EMAIL,
      subject: `📦 New Order #${orderId}`,
      text: `New Order Notification\n\n` +
            `Order ID: ${orderId}\n` +
            `Customer: ${user.name}\n` +
            `Email: ${user.email}\n` +
            `Phone: ${user.phone || 'Not provided'}\n\n` +
            `Order Items:\n${itemDetails}\n\n` +
            `Total Amount: ₹${totalAmount}\n` +
            `Order Time: ${new Date().toLocaleString()}`,
      
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">📦 New Order #${orderId}</h2>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px;">
            <p><strong>Customer:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            ${user.phone ? `<p><strong>Phone:</strong> ${user.phone}</p>` : ''}
          </div>
          <h3 style="margin-top: 20px;">Order Items:</h3>
          <ul style="list-style-type: none; padding: 0;">
            ${items.map(item => `
              <li style="padding: 8px 0; border-bottom: 1px solid #eee;">
                ${item.quantity}x ${item.product?.name || 'Item'} - ₹${item.price || '0.00'}
              </li>
            `).join('')}
          </ul>
          <div style="margin-top: 20px; font-weight: bold;">
            Total Amount: ₹${totalAmount}
          </div>
          <p style="margin-top: 30px; color: #7f8c8d; font-size: 0.9em;">
            Order received at ${new Date().toLocaleString()}
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Order email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending order email:', error);
    throw new Error('Failed to send order confirmation email');
  }
};

export { transporter };