import mongoose, { Schema, Document, Model } from 'mongoose';

interface IConversation extends Document {
  name?: string;
  isGroup: boolean;
  participants: string[];
  createdBy: string;
  createdAt: Date;
  lastActivity: Date;
  lastMessage?: mongoose.Types.ObjectId;
}

interface IConversationModel extends Model<IConversation> {
  findOrCreateDM(userId1: string, userId2: string): Promise<IConversation>;
}

const conversationSchema = new Schema<IConversation>({
  name: {
    type: String,
    required: function (this: any) {
      return this.isGroup;
    },
  },
  isGroup: {
    type: Boolean,
    default: false,
  },
  participants: [
    {
      type: String,
      required: true,
    },
  ],
  createdBy: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastMessage: {
    type: Schema.Types.ObjectId,
    ref: 'Message',
  },
  lastActivity: {
    type: Date,
    default: Date.now,
  },
});

conversationSchema.index({ participants: 1 });
conversationSchema.index({ createdAt: -1 });
conversationSchema.index({ lastActivity: -1 });

conversationSchema.statics.findOrCreateDM = async function (userId1: string, userId2: string) {
  const participants = [userId1, userId2].sort();

  let conversation = await this.findOne({
    isGroup: false,
    participants: { $all: participants, $size: 2 },
  });

  if (!conversation) {
    conversation = await this.create({
      isGroup: false,
      participants,
      createdBy: userId1,
    });
  }

  return conversation;
};

const Conversation = mongoose.model<IConversation, IConversationModel>(
  'Conversation',
  conversationSchema
);

export default Conversation;
