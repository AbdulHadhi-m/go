import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['booking', 'account', 'offer', 'admin', 'system', 'engagement'],
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String, // Optional URL or deep link to redirect on click
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed, // Extra data like bookingId, paymentId
      default: {},
    },
    deliveryChannels: {
      type: [String],
      enum: ['in-app', 'email', 'push', 'sms'],
      default: ['in-app'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for getting a user's recent notifications efficiently
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
