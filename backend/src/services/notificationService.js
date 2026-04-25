import Notification from '../models/Notification.js';
import { getIO } from '../config/socket.js';
import { queueEmailNotification } from '../queues/notificationQueue.js';

/**
 * Main unifying service to create and dispatch notifications across multiple channels
 *
 * @param {Object} params
 * @param {String} params.user - User ObjectId
 * @param {String} params.title - Notification title
 * @param {String} params.message - Notification message
 * @param {String} params.category - 'booking', 'account', 'offer', 'admin', 'system', 'engagement'
 * @param {String} [params.link] - Deep link URL
 * @param {Object} [params.metadata] - Extra context (e.g. { bookingId: '...' })
 * @param {Array} [params.deliveryChannels] - e.g. ['in-app', 'email']
 * @param {Object} [params.emailData] - Required if 'email' is in deliveryChannels
 * @param {String} params.emailData.to - Email address of the user
 * @param {String} params.emailData.templateType - Template to use (e.g. 'booking_confirmed')
 * @param {Number} [params.delayEmail] - Delay in milliseconds before sending email
 */
export const createAndSendNotification = async ({
  user,
  title,
  message,
  category,
  link = null,
  metadata = {},
  deliveryChannels = ['in-app'],
  emailData = null,
  delayEmail = 0,
}) => {
  try {
    let notificationDoc = null;

    // 1. In-App: Save to MongoDB
    if (deliveryChannels.includes('in-app')) {
      notificationDoc = await Notification.create({
        user,
        title,
        message,
        category,
        link,
        metadata,
        deliveryChannels,
      });

      // 2. Real-time: Emit to user's personal room via Socket.IO
      try {
        const io = getIO();
        io.to(user.toString()).emit('new_notification', notificationDoc);
      } catch (wsError) {
        // Log but do not block execution if socket fails or isn't initialized yet
        console.warn('Could not emit Socket.IO notification:', wsError.message);
      }
    }

    // 3. Email: Send synchronously (Directly using NodeMailer instead of BullMQ)
    if (deliveryChannels.includes('email') && emailData) {
      if (!emailData.to) {
        console.warn('Email notification skipped: No recipient email provided.');
      } else {
        try {
          // Temporarily bypassing BullMQ and sending email directly so it works without Redis
          const { sendEmail } = await import('../utils/sendEmail.js');
          
          const info = await sendEmail({
            to: emailData.to,
            subject: title,
            templateType: emailData.templateType || 'generic',
            data: {
              ...metadata,
              message,
              link,
            },
          });
          
          const nodemailerLib = await import('nodemailer');
          const previewUrl = nodemailerLib.getTestMessageUrl(info);
          
          if (previewUrl && notificationDoc) {
             notificationDoc.message = notificationDoc.message + `  (TEST EMAIL PREVIEW GENERATED: ${previewUrl})`;
             await notificationDoc.save();
          }
          
          console.log(`Direct email sent to ${emailData.to} for ${title}`);
        } catch (emailError) {
          console.error('Could not send direct email:', emailError.message);
        }
      }
    }

    return notificationDoc;
  } catch (error) {
    console.error('Error in createAndSendNotification:', error);
    throw new Error('Failed to create and send notification');
  }
};
