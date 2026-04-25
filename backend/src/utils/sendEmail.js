import nodemailer from 'nodemailer';

// General Transporter Setup
let testAccount = null;

const createTransporter = async () => {
  // If user provided valid env vars, use them
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Otherwise, automatically create a fake testing account that catches emails!
  if (!testAccount) {
    console.log('No SMTP credentials found in .env, automatically generating Ethereal test account...');
    testAccount = await nodemailer.createTestAccount();
  }

  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

/**
 * Base professional HTML template for emails
 */
const getHtmlTemplate = (title, contentContent) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #f4f7fa; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
    .header { background-color: #002468; padding: 25px; text-align: center; color: white; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
    .content { padding: 30px; color: #333333; line-height: 1.6; }
    .footer { background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #eeeeee; }
    .btn { display: inline-block; padding: 12px 24px; background-color: #f97316; color: white; text-decoration: none; border-radius: 6px; font-weight: 500; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>GoPath</h1>
    </div>
    <div class="content">
      <h2>${title}</h2>
      ${contentContent}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} GoPath Bus Booking. All rights reserved.</p>
      <p>Need help? Contact support at support@gopath.com</p>
    </div>
  </div>
</body>
</html>
`;

/**
 * Main email sender service
 */
export const sendEmail = async ({ to, subject, templateType, data }) => {
  if (!to) throw new Error('Recipient email is required.');

  const transporter = await createTransporter();
  let htmlContent = '';
  let title = subject;

  switch (templateType) {
    case 'booking_confirmed':
      title = 'Booking Confirmed!';
      htmlContent = `
        <p>Dear Customer,</p>
        <p>Your bus booking to <strong>${data.destination || 'your destination'}</strong> has been confirmed.</p>
        <p><strong>Booking ID:</strong> ${data.bookingId}</p>
        <p><strong>Date of Journey:</strong> ${data.journeyDate}</p>
        <p>Have a safe and pleasant journey!</p>
        ${data.link ? `<a href="${data.link}" class="btn">View Booking Details</a>` : ''}
      `;
      break;

    case 'booking_cancelled':
      title = 'Booking Cancelled';
      htmlContent = `
        <p>Dear Customer,</p>
        <p>Your booking <strong>${data.bookingId}</strong> has been cancelled successfully.</p>
        <p>If applicable, a refund will be initiated and processed within 3-5 business days depending on the cancellation policy.</p>
        ${data.link ? `<a href="${data.link}" class="btn">View Details</a>` : ''}
      `;
      break;

    case 'payment_success':
      title = 'Payment Successful';
      htmlContent = `
        <p>Dear Customer,</p>
        <p>We have successfully received your payment of <strong>₹${data.amount}</strong> for booking ID <strong>${data.bookingId}</strong>.</p>
        <p>Thank you for choosing GoPath!</p>
        ${data.link ? `<a href="${data.link}" class="btn">Download Receipt</a>` : ''}
      `;
      break;

    case 'refund_processed':
      title = 'Refund Processed';
      htmlContent = `
        <p>Dear Customer,</p>
        <p>Your refund of <strong>₹${data.amount}</strong> for the booking ID <strong>${data.bookingId}</strong> has been processed successfully.</p>
        <p>It may take 3-5 business days to reflect in your original payment method.</p>
      `;
      break;

    case 'welcome_message':
      title = 'Welcome to GoPath!';
      htmlContent = `
        <p>Hi ${data.firstName || 'there'},</p>
        <p>We are thrilled to welcome you to GoPath. Start exploring premium routes and book your next journey today!</p>
        ${data.link ? `<a href="${data.link}" class="btn">Explore Now</a>` : ''}
      `;
      break;

    case 'security_alert':
      title = 'Security Alert: New Login Detected';
      htmlContent = `
        <p>We noticed a new login to your GoPath account from a new device or location.</p>
        <p><strong>Device Info:</strong> ${data.deviceInfo || 'Unknown Device'}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        <p>If this was you, you can safely ignore this email. If not, please secure your account immediately.</p>
        ${data.link ? `<a href="${data.link}" class="btn">Secure Account</a>` : ''}
      `;
      break;

    case 'password_changed':
      title = 'Password Changed Successfully';
      htmlContent = `
        <p>Hi,</p>
        <p>Your account password was recently changed. If you made this change, you can safely ignore this email.</p>
        <p>If you did not request this, please reset your password immediately and contact support.</p>
        ${data.link ? `<a href="${data.link}" class="btn">Reset Password</a>` : ''}
      `;
      break;

    case 'offer_alert':
    case 'discount_offer':
    case 'new_coupon':
      title = 'Exclusive Offer for You!';
      htmlContent = `
        <p>Hi there,</p>
        <p>We have a special offer just for you! Use code <strong>${data.couponCode}</strong> to get an exciting discount on your next ride.</p>
        ${data.link ? `<a href="${data.link}" class="btn">Redeem Now</a>` : ''}
      `;
      break;
      
    case 'system_announcement':
    case 'important_notice':
      title = 'GoPath Important Update';
      htmlContent = `
        <p>Hello,</p>
        <p>${data.message}</p>
        ${data.link ? `<a href="${data.link}" class="btn">Learn More</a>` : ''}
      `;
      break;

    case 'maintenance_alert':
      title = 'Scheduled Maintenance Alert';
      htmlContent = `
        <p>Dear User,</p>
        <p>Please note that the GoPath platform will be undergoing scheduled maintenance on <strong>${data.maintenanceDate || 'shortly'}</strong>.</p>
        <p>During this time, you may experience brief interruptions. We apologize for any inconvenience.</p>
      `;
      break;

    case 'route_update':
      title = 'Route or Service Update';
      htmlContent = `
        <p>Dear Customer,</p>
        <p>There has been an update regarding your upcoming journey or a route you frequently travel.</p>
        <p><strong>Update Details:</strong> ${data.message}</p>
        ${data.link ? `<a href="${data.link}" class="btn">View Update</a>` : ''}
      `;
      break;

    case 'cashback_alert':
      title = 'Cashback Received!';
      htmlContent = `
        <p>Congratulations!</p>
        <p>You have received a cashback of <strong>₹${data.amount}</strong> in your GoPath wallet.</p>
        <p>Use this towards your next booking to save more.</p>
        ${data.link ? `<a href="${data.link}" class="btn">View Wallet</a>` : ''}
      `;
      break;

    case 'rating_reminder':
      title = 'How was your recent trip?';
      htmlContent = `
        <p>Hi ${data.firstName || 'Traveller'},</p>
        <p>We hope you enjoyed your recent journey to <strong>${data.destination || 'your destination'}</strong>.</p>
        <p>Your feedback helps us and other travellers. Please take a moment to rate your trip.</p>
        ${data.link ? `<a href="${data.link}" class="btn">Rate Trip</a>` : ''}
      `;
      break;

    default:
      // Generic template
      htmlContent = `
        <p>${data.message}</p>
        ${data.link ? `<a href="${data.link}" class="btn">Click Here</a>` : ''}
      `;
      break;
  }

  const mailOptions = {
    from: `"GoPath Alerts" <${process.env.SMTP_FROM_EMAIL || 'noreply@gopath.com'}>`,
    to,
    subject,
    html: getHtmlTemplate(title, htmlContent),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}. Message ID: ${info.messageId}`);
    
    // Log the preview URL if it's an ethereal test account
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`\n=========================================\n`);
      console.log(`📬 TEST EMAIL PREVIEW READY:`);
      console.log(`${previewUrl}`);
      console.log(`\n=========================================\n`);
    }
    
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
