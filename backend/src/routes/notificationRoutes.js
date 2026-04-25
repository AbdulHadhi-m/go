import express from 'express';
import {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getMyNotifications)
  .delete(clearAllNotifications);

router.get('/unread-count', getUnreadCount);
router.patch('/read-all', markAllAsRead);

router.route('/:id')
  .delete(deleteNotification);

router.patch('/:id/read', markAsRead);

export default router;
