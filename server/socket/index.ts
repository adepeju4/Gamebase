import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { verifyToken } from '../utils/jwt.js';
import User from '../models/Auth.js';
import { UserStatus } from '../types/enums.js';
import { registerGameHandlers } from './handlers/game.js';
import { registerChatHandlers } from './handlers/chat.js';

const gameRooms = new Map<string, any>();

export const initializeSocket = (httpServer: HttpServer): Server => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Auth middleware — verify JWT and attach user to every socket
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return next(new Error('Authentication error: Invalid or expired token'));
    }

    const user = await User.findOne({ userId: decoded.userId });

    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }

    socket.data.user = {
      userId: user.userId,
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    next();
  });

  io.on('connection', socket => {
    const { userId, userName } = socket.data.user;
    console.log(`User connected: ${userName} (${userId})`);

    registerGameHandlers(io, socket, gameRooms);
    registerChatHandlers(io, socket, gameRooms);

    socket.on('disconnect', async () => {
      await User.findOneAndUpdate(
        { userId },
        { status: UserStatus.Offline, lastActive: new Date() }
      );
    });
  });

  return io;
};
