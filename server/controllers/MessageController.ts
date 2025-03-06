import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import User from '../models/Auth.js';
import { createError } from '../utils/validateFields.js';

interface MessageBody {
  content: string;
  conversationId: string;
  attachments?: Array<{
    type: string;
    url: string;
    name?: string;
  }>;
}

const MessageController = {
  // Get messages for a conversation
  getMessages: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = res.locals.user.userId;
      const conversationId = req.params.id;
      const limit = parseInt(req.query.limit as string) || 20;
      const before = req.query.before as string;

      // Verify user is part of the conversation
      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: userId,
      });

      if (!conversation) {
        return next(createError('Conversation not found or you do not have access'));
      }

      // Build query
      const query: any = { conversationId };
      if (before) {
        query._id = { $lt: before };
      }

      // Get messages
      const messages = await Message.find(query).sort({ timestamp: -1 }).limit(limit).lean();

      // Mark messages as read
      const updateResult = await Message.updateMany(
        {
          conversationId,
          sender: { $ne: userId },
          'readBy.userId': { $ne: userId },
        },
        {
          $push: {
            readBy: {
              userId,
              readAt: new Date(),
            },
          },
        }
      );

      // If messages were marked as read, update user's unread count
      if (updateResult.modifiedCount > 0) {
        // Get total unread count for the user
        const unreadCount = await Message.countDocuments({
          conversationId: { $in: await getUserConversationIds(userId) },
          sender: { $ne: userId },
          'readBy.userId': { $ne: userId },
        });

        // Update user's unread message count
        await User.updateOne({ userId }, { unreadMessages: unreadCount });
      }

      res.locals.messages = messages.reverse();
      return next();
    } catch (error) {
      return next(createError(error));
    }
  },

  // Send a new message
  sendMessage: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = res.locals.user.userId;
      const { content, conversationId, attachments } = req.body as MessageBody;

      // Verify user is part of the conversation
      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: userId,
      });

      if (!conversation) {
        return next(createError('Conversation not found or you do not have access'));
      }

      // Create the message
      const message = await Message.create({
        conversationId,
        sender: userId,
        content,
        attachments: attachments || [],
        readBy: [{ userId, readAt: new Date() }],
      });

      // Update conversation with last message and activity
      conversation.lastMessage = message._id;
      conversation.lastActivity = new Date();
      await conversation.save();

      // Increment unread message count for other participants
      for (const participantId of conversation.participants) {
        if (participantId !== userId) {
          // Get current unread count
          const user = await User.findOne({ userId: participantId });
          if (user) {
            const currentUnreadCount = user.unreadMessages || 0;
            await User.updateOne(
              { userId: participantId },
              { unreadMessages: currentUnreadCount + 1 }
            );
          }
        }
      }

      res.locals.message = message;
      return next();
    } catch (error) {
      return next(createError(error));
    }
  },

  // Delete a message
  deleteMessage: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = res.locals.user.userId;
      const messageId = req.params.id;

      // Find the message and ensure the user is the sender
      const message = await Message.findOne({
        _id: messageId,
        sender: userId,
      });

      if (!message) {
        return next(createError('Message not found or you are not the sender'));
      }

      // Soft delete by updating content
      message.content = 'This message has been deleted';
      message.attachments = [];
      message.isDeleted = true;
      await message.save();

      res.locals.message = message;
      return next();
    } catch (error) {
      return next(createError(error));
    }
  },

  // Mark messages as read
  markAsRead: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = res.locals.user.userId;
      const conversationId = req.params.id;

      // Verify user is part of the conversation
      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: userId,
      });

      if (!conversation) {
        return next(createError('Conversation not found or you do not have access'));
      }

      // Mark all messages as read
      const result = await Message.updateMany(
        {
          conversationId,
          sender: { $ne: userId },
          'readBy.userId': { $ne: userId },
        },
        {
          $push: {
            readBy: {
              userId,
              readAt: new Date(),
            },
          },
        }
      );

      // Update user's unread message count
      if (result.modifiedCount > 0) {
        // Get total unread count for the user
        const unreadCount = await Message.countDocuments({
          conversationId: { $in: await getUserConversationIds(userId) },
          sender: { $ne: userId },
          'readBy.userId': { $ne: userId },
        });

        // Update user's unread message count
        await User.updateOne({ userId }, { unreadMessages: unreadCount });
      }

      res.locals.result = {
        success: true,
        messagesRead: result.modifiedCount,
      };
      return next();
    } catch (error) {
      return next(createError(error));
    }
  },

  // Get unread message count
  getUnreadCount: async (_: Request, res: Response, next: NextFunction) => {
    try {
      const userId = res.locals.user.userId;

      // Find conversations where user is a participant
      const conversations = await Conversation.find({
        participants: userId,
      }).select('_id');

      const conversationIds = conversations.map(c => c._id);

      // Count unread messages
      const unreadCounts = await Message.aggregate([
        {
          $match: {
            conversationId: { $in: conversationIds },
            sender: { $ne: userId },
            'readBy.userId': { $ne: userId },
          },
        },
        {
          $group: {
            _id: '$conversationId',
            count: { $sum: 1 },
          },
        },
      ]);

      // Calculate total unread count
      const totalUnread = unreadCounts.reduce((sum, item) => sum + item.count, 0);

      // Update user's unread message count
      await User.updateOne({ userId }, { unreadMessages: totalUnread });

      // Format the result
      const result = {
        total: totalUnread,
        byConversation: Object.fromEntries(
          unreadCounts.map(item => [item._id.toString(), item.count])
        ),
      };

      res.locals.unreadCounts = result;
      return next();
    } catch (error) {
      return next(createError(error));
    }
  },
};

// Helper function to get all conversation IDs for a user
async function getUserConversationIds(userId: string): Promise<mongoose.Types.ObjectId[]> {
  const user = await User.findOne({ userId }).select('conversations');
  if (!user || !user.conversations || user.conversations.length === 0) {
    return [];
  }
  return user.conversations;
}

export default MessageController;
