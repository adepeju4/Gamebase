import { Request, Response, NextFunction } from 'express';
import Conversation from '../models/Conversation.js';

import User from '../models/Auth.js';
import { createError } from '../utils/validateFields.js';

interface ConversationBody {
  name?: string;
  isGroup: boolean;
  participants: string[];
}

const ConversationController = {
  // Get all conversations for a user
  getConversations: async (_: Request, res: Response, next: NextFunction) => {
    try {
      const userId = res.locals.user.userId;

      // Find all conversations where the user is a participant
      const conversations = await Conversation.find({
        participants: userId,
      })
        .sort({ lastActivity: -1 })
        .populate('lastMessage')
        .lean();

      res.locals.conversations = conversations;
      return next();
    } catch (error) {
      return next(createError(error));
    }
  },

  // Get a single conversation by ID
  getConversation: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = res.locals.user.userId;
      const conversationId = req.params.id;

      // Find the conversation and ensure the user is a participant
      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: userId,
      })
        .populate('lastMessage')
        .lean();

      if (!conversation) {
        return next(createError('Conversation not found or you do not have access'));
      }

      res.locals.conversation = conversation;
      return next();
    } catch (error) {
      return next(createError(error));
    }
  },

  // Create a new conversation (direct message or group chat)
  createConversation: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = res.locals.user.userId;
      const { name, isGroup, participants } = req.body as ConversationBody;

      // Ensure the creator is included in participants
      if (!participants.includes(userId)) {
        participants.push(userId);
      }

      // For direct messages, find or create
      if (!isGroup && participants.length === 2) {
        const otherUserId = participants.find(id => id !== userId);
        if (!otherUserId) {
          return next(createError('Invalid participants for direct message'));
        }

        const conversation = await Conversation.findOrCreateDM(userId, otherUserId);

        // Add conversation to both users' conversation lists if not already there
        for (const participantId of participants) {
          const user = await User.findOne({ userId: participantId });
          if (user) {
            // Check if conversation is already in user's conversations
            const hasConversation =
              user.conversations &&
              user.conversations.some(conv => conv.toString() === conversation._id.toString());

            if (!hasConversation) {
              // Add conversation to user's list
              await User.updateOne(
                { userId: participantId },
                { $push: { conversations: conversation._id } }
              );
            }
          }
        }

        res.locals.conversation = conversation;
        return next();
      }

      // For group chats, create new
      if (isGroup) {
        if (!name) {
          return next(createError('Group chat name is required'));
        }

        if (participants.length < 2) {
          return next(createError('Group chat requires at least 2 participants'));
        }

        const conversation = await Conversation.create({
          name,
          isGroup: true,
          participants,
          createdBy: userId,
        });

        // Add conversation to all participants' conversation lists
        for (const participantId of participants) {
          await User.updateOne(
            { userId: participantId },
            { $push: { conversations: conversation._id } }
          );
        }

        res.locals.conversation = conversation;
        return next();
      }

      return next(createError('Invalid conversation type'));
    } catch (error) {
      return next(createError(error));
    }
  },

  // Add participants to a group chat
  addParticipants: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = res.locals.user.userId;
      const conversationId = req.params.id;
      const { participants } = req.body as { participants: string[] };

      // Find the conversation and ensure the user is a participant
      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: userId,
        isGroup: true, // Only group chats can add participants
      });

      if (!conversation) {
        return next(createError('Group chat not found or you do not have access'));
      }

      // Add new participants
      const updatedParticipants = [...new Set([...conversation.participants, ...participants])];
      conversation.participants = updatedParticipants;
      await conversation.save();

      // Add conversation to new participants' conversation lists
      for (const participantId of participants) {
        // Only add if they're not already in the conversation
        if (!conversation.participants.includes(participantId)) {
          await User.updateOne(
            { userId: participantId },
            { $push: { conversations: conversation._id } }
          );
        }
      }

      res.locals.conversation = conversation;
      return next();
    } catch (error) {
      return next(createError(error));
    }
  },

  // Remove a participant from a group chat
  removeParticipant: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = res.locals.user.userId;
      const conversationId = req.params.id;
      const { participantId } = req.body as { participantId: string };

      // Find the conversation and ensure the user is a participant
      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: userId,
        isGroup: true, // Only group chats can remove participants
      });

      if (!conversation) {
        return next(createError('Group chat not found or you do not have access'));
      }

      // Cannot remove the last participant
      if (conversation.participants.length <= 2) {
        return next(createError('Cannot remove the last participant from a group chat'));
      }

      // Remove the participant
      conversation.participants = conversation.participants.filter(id => id !== participantId);
      await conversation.save();

      // Remove conversation from the participant's conversation list
      await User.updateOne(
        { userId: participantId },
        { $pull: { conversations: conversation._id } }
      );

      res.locals.conversation = conversation;
      return next();
    } catch (error) {
      return next(createError(error));
    }
  },

  // Leave a conversation
  leaveConversation: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = res.locals.user.userId;
      const conversationId = req.params.id;

      // Find the conversation
      const conversation = await Conversation.findById(conversationId);

      if (!conversation) {
        return next(createError('Conversation not found'));
      }

      // Cannot leave a direct message
      if (!conversation.isGroup) {
        return next(createError('Cannot leave a direct message'));
      }

      // Remove the user from participants
      conversation.participants = conversation.participants.filter(id => id !== userId);

      // Remove conversation from the user's conversation list
      await User.updateOne({ userId }, { $pull: { conversations: conversation._id } });

      // If no participants left, delete the conversation
      if (conversation.participants.length === 0) {
        await Conversation.findByIdAndDelete(conversationId);
        res.locals.result = { success: true, message: 'Group chat deleted' };
      } else {
        await conversation.save();
        res.locals.conversation = conversation;
      }

      return next();
    } catch (error) {
      return next(createError(error));
    }
  },

  // Search for users to add to conversations
  searchUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = res.locals.user.userId;
      const query = req.query.q as string;

      if (!query || query.length < 2) {
        return next(createError('Search query must be at least 2 characters'));
      }

      // Search for users by name or username
      const users = await User.find({
        $and: [
          { userId: { $ne: userId } }, // Exclude current user
          {
            $or: [
              { userName: { $regex: query, $options: 'i' } },
              { firstName: { $regex: query, $options: 'i' } },
              { lastName: { $regex: query, $options: 'i' } },
            ],
          },
        ],
      })
        .select('userId userName firstName lastName profileImage status')
        .limit(10);

      res.locals.users = users;
      return next();
    } catch (error) {
      return next(createError(error));
    }
  },
};

export default ConversationController;
