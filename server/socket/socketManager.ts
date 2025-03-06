import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import User from '../models/Auth.js';

// Active game rooms
const gameRooms = new Map<string, any>();

// Initialize Socket.io server
export const initializeSocketServer = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error: Token not provided'));
    }
    
    try {
      // Find user by token
      const user = await User.findOne({ token });
      
      if (!user) {
        return next(new Error('Authentication error: Invalid token'));
      }
      
      // Attach user data to socket
      socket.data.user = {
        userId: user.userId,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName
      };
      
      next();
    } catch (error: any) {
      return next(new Error('Authentication error: ' + error.message));
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.data.user.userName} (${socket.id})`);
    
    // Create a game room
    socket.on('room:create', (data) => {
      try {
        const { gameType, rivals } = data;
        const roomId = `${gameType}_${Date.now()}_${socket.data.user.userId}`;
        
        // Create room
        gameRooms.set(roomId, {
          id: roomId,
          gameType,
          creator: socket.data.user.userId,
          players: [socket.data.user.userId],
          rivals,
          state: {
            board: null,
            currentTurn: socket.data.user.userId,
            moves: []
          },
          createdAt: new Date()
        });
        
        // Join the room
        socket.join(roomId);
        
        // Notify client
        socket.emit('room:created', { roomId });
        
        console.log(`Room created: ${roomId} by ${socket.data.user.userName}`);
      } catch (error: any) {
        socket.emit('room:error', error.message);
      }
    });
    
    // Join a game room
    socket.on('room:join', (data) => {
      try {
        const { roomId } = data;
        const room = gameRooms.get(roomId);
        
        if (!room) {
          return socket.emit('room:error', 'Room not found');
        }
        
        // Add player to room
        if (!room.players.includes(socket.data.user.userId)) {
          room.players.push(socket.data.user.userId);
        }
        
        // Join the room
        socket.join(roomId);
        
        // Notify all clients in the room
        io.to(roomId).emit('room:players', {
          players: room.players,
          currentTurn: room.state.currentTurn
        });
        
        console.log(`User ${socket.data.user.userName} joined room ${roomId}`);
      } catch (error: any) {
        socket.emit('room:error', error.message);
      }
    });
    
    // Leave a game room
    socket.on('room:leave', (data) => {
      try {
        const { roomId } = data;
        const room = gameRooms.get(roomId);
        
        if (room) {
          // Remove player from room
          room.players = room.players.filter((id: string) => id !== socket.data.user.userId);
          
          // Leave the room
          socket.leave(roomId);
          
          // If room is empty, delete it
          if (room.players.length === 0) {
            gameRooms.delete(roomId);
            console.log(`Room ${roomId} deleted (empty)`);
          } else {
            // Notify remaining clients
            io.to(roomId).emit('room:players', {
              players: room.players,
              currentTurn: room.state.currentTurn
            });
          }
          
          console.log(`User ${socket.data.user.userName} left room ${roomId}`);
        }
      } catch (error: any) {
        socket.emit('room:error', error.message);
      }
    });
    
    // Game move
    socket.on('game:move', (data) => {
      try {
        const { roomId, move } = data;
        const room = gameRooms.get(roomId);
        
        if (!room) {
          return socket.emit('game:error', 'Room not found');
        }
        
        // Check if it's the player's turn
        if (room.state.currentTurn !== socket.data.user.userId) {
          return socket.emit('game:error', 'Not your turn');
        }
        
        // Add move to history
        room.state.moves.push({
          userId: socket.data.user.userId,
          move,
          timestamp: new Date()
        });
        
        // Update game state (this would be game-specific logic)
        // For now, just toggle turn between players
        const otherPlayers = room.players.filter((id: string) => id !== socket.data.user.userId);
        if (otherPlayers.length > 0) {
          room.state.currentTurn = otherPlayers[0];
        }
        
        // Broadcast updated state to all clients in the room
        io.to(roomId).emit('game:state', {
          board: room.state.board,
          currentTurn: room.state.currentTurn,
          lastMove: {
            userId: socket.data.user.userId,
            move
          }
        });
        
        console.log(`Move in room ${roomId} by ${socket.data.user.userName}`);
      } catch (error: any) {
        socket.emit('game:error', error.message);
      }
    });
    
    // Chat message
    socket.on('chat:message', (data) => {
      try {
        const { roomId, message } = data;
        const room = gameRooms.get(roomId);
        
        if (!room) {
          return socket.emit('chat:error', 'Room not found');
        }
        
        // Add unique ID to message
        const messageWithId = {
          ...message,
          id: `${Date.now()}_${socket.id}`
        };
        
        // Broadcast message to all clients in the room
        io.to(roomId).emit('chat:message', messageWithId);
        
        console.log(`Chat message in room ${roomId} by ${socket.data.user.userName}`);
      } catch (error: any) {
        socket.emit('chat:error', error.message);
      }
    });
    
    // Disconnect handler
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.data.user.userName} (${socket.id})`);
      
      // Leave all rooms
      for (const [roomId, room] of gameRooms.entries()) {
        if (room.players.includes(socket.data.user.userId)) {
          // Remove player from room
          room.players = room.players.filter((id: string) => id !== socket.data.user.userId);
          
          // If room is empty, delete it
          if (room.players.length === 0) {
            gameRooms.delete(roomId);
            console.log(`Room ${roomId} deleted (empty)`);
          } else {
            // Notify remaining clients
            io.to(roomId).emit('room:players', {
              players: room.players,
              currentTurn: room.state.currentTurn
            });
          }
        }
      }
    });
  });

  return io;
};

export default { initializeSocketServer }; 