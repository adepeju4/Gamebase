import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: 'string',
    required: true,
  },
  lastName: {
    type: 'string',
    required: true,
  },
  userName: {
    type: 'string',
    required: true,
    unique: true,
  },
  email: {
    type: 'string',
    required: true,
    unique: true,
  },
  password: {
    type: 'string',
    required: true,
  },
  userId: {
    type: 'string',
    required: true,
  },
  conversations: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
    },
  ],
  unreadMessages: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'away'],
    default: 'offline',
  },
  profileImage: {
    type: String,
    default: '',
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('user', userSchema);
export default User;
