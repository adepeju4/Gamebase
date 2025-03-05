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
  password: {
    type: 'string',
    required: true,
  },
  token: {
    type: 'string',
    required: true,
  },
  userId: {
    type: 'string',
    required: true,
  },
});

const User = mongoose.model('user', userSchema);
export default User;
