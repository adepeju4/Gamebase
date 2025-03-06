import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for a message
interface IMessage extends Document {
  conversationId: mongoose.Types.ObjectId;
  sender: string;
  content: string;
  timestamp: Date;
  readBy: Array<{
    userId: string;
    readAt: Date;
  }>;
  attachments: Array<{
    type: string;
    url: string;
    name?: string;
    size?: number;
  }>;
  isDeleted: boolean;
}

// Create the message schema
const messageSchema = new Schema<IMessage>({
  conversationId: {
    type: Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  readBy: [
    {
      userId: String,
      readAt: Date,
    },
  ],
  attachments: [
    {
      type: String,
      url: String,
      name: String,
      size: Number,
    },
  ],
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// Create indexes for faster queries
messageSchema.index({ conversationId: 1, timestamp: -1 });
messageSchema.index({ sender: 1 });

// Create and export the Message model
const Message = mongoose.model<IMessage>('Message', messageSchema);
export default Message;
