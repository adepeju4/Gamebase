import express from 'express';
import ConversationController from '../controllers/ConversationController.js';
import MessageController from '../controllers/MessageController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Conversation routes
router.get('/', ConversationController.getConversations, (_, res) => {
  res.status(200).json(res.locals.conversations);
});

router.get('/:id', ConversationController.getConversation, (_, res) => {
  res.status(200).json(res.locals.conversation);
});

router.post('/', ConversationController.createConversation, (_, res) => {
  res.status(201).json(res.locals.conversation);
});

router.post('/:id/participants', ConversationController.addParticipants, (_, res) => {
  res.status(200).json(res.locals.conversation);
});

router.delete('/:id/participants', ConversationController.removeParticipant, (_, res) => {
  res.status(200).json(res.locals.conversation);
});

router.delete('/:id/leave', ConversationController.leaveConversation, (_, res) => {
  if (res.locals.result) {
    res.status(200).json(res.locals.result);
  } else {
    res.status(200).json(res.locals.conversation);
  }
});

// Message routes within conversations
router.get('/:id/messages', MessageController.getMessages, (_, res) => {
  res.status(200).json(res.locals.messages);
});

router.post('/:id/messages', MessageController.sendMessage, (_, res) => {
  res.status(201).json(res.locals.message);
});

router.post('/:id/read', MessageController.markAsRead, (_, res) => {
  res.status(200).json(res.locals.result);
});

// Unread message count
router.get('/unread/count', MessageController.getUnreadCount, (_, res) => {
  res.status(200).json(res.locals.unreadCounts);
});

// Search users
router.get('/users/search', ConversationController.searchUsers, (_, res) => {
  res.status(200).json(res.locals.users);
});

export default router; 