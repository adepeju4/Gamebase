import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server } from 'socket.io';

interface ErrorObject {
  log?: string;
  status?: number;
  message?: { err: string };
}

// Initialize dotenv before creating the app
dotenv.config();

// Create the app and HTTP server
const app = express();
const server = http.createServer(app);

try {
  app.use(cors());
  app.use(express.json());

  // Get __dirname equivalent in ESM
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Serve static files in production
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../dist")));
  }

  // Import router and database
  Promise.all([
    import('./routes/index.js'),
    import('./database/db.js')
  ]).then(async ([routerModule, dbModule]) => {
    const router = routerModule.default;
    const startDB = dbModule.default;
    
    // Initialize Socket.io
    const io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });
    
    // Store active game rooms
    const gameRooms = new Map();
    
    // Socket.io connection handler
    io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);
      
      // Create a game room
      socket.on('room:create', (data) => {
        try {
          const { gameType, rivals } = data;
          const roomId = `${gameType}_${Date.now()}_${socket.id}`;
          
          // Create room
          gameRooms.set(roomId, {
            id: roomId,
            gameType,
            creator: socket.id,
            players: [socket.id],
            rivals,
            state: {
              board: Array(3).fill(null).map(() => Array(3).fill(null)),
              currentTurn: socket.id,
              moves: []
            },
            createdAt: new Date()
          });
          
          // Join the room
          socket.join(roomId);
          
          // Notify client
          socket.emit('room:created', { roomId });
          
          console.log(`Room created: ${roomId}`);
        } catch (error) {
          socket.emit('room:error', 'Failed to create room');
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
          if (!room.players.includes(socket.id)) {
            room.players.push(socket.id);
          }
          
          // Join the room
          socket.join(roomId);
          
          // Notify all clients in the room
          io.to(roomId).emit('room:players', {
            players: room.players,
            currentTurn: room.state.currentTurn
          });
          
          console.log(`User ${socket.id} joined room ${roomId}`);
        } catch (error) {
          socket.emit('room:error', 'Failed to join room');
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
          if (room.state.currentTurn !== socket.id) {
            return socket.emit('game:error', 'Not your turn');
          }
          
          // Update the board
          const { rowIndex, columnIndex } = move;
          if (room.state.board[rowIndex][columnIndex] !== null) {
            return socket.emit('game:error', 'Invalid move');
          }
          
          // Set the player's mark (X or O)
          const mark = room.players.indexOf(socket.id) === 0 ? 'X' : 'O';
          room.state.board[rowIndex][columnIndex] = mark;
          
          // Add move to history
          room.state.moves.push({
            userId: socket.id,
            move,
            mark,
            timestamp: new Date()
          });
          
          // Check for win
          let winner = null;
          const board = room.state.board;
          
          // Check rows
          for (let i = 0; i < 3; i++) {
            if (board[i][0] && board[i][0] === board[i][1] && board[i][0] === board[i][2]) {
              winner = socket.id;
            }
          }
          
          // Check columns
          for (let i = 0; i < 3; i++) {
            if (board[0][i] && board[0][i] === board[1][i] && board[0][i] === board[2][i]) {
              winner = socket.id;
            }
          }
          
          // Check diagonals
          if (board[0][0] && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
            winner = socket.id;
          }
          if (board[0][2] && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
            winner = socket.id;
          }
          
          // Check for draw
          let isDraw = true;
          for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
              if (board[i][j] === null) {
                isDraw = false;
              }
            }
          }
          
          // Update game state
          if (winner) {
            room.state.winner = winner;
          } else if (isDraw) {
            room.state.isDraw = true;
          } else {
            // Toggle turn
            const otherPlayers = room.players.filter((id: string) => id !== socket.id);
            if (otherPlayers.length > 0) {
              room.state.currentTurn = otherPlayers[0];
            }
          }
          
          // Broadcast updated state to all clients in the room
          io.to(roomId).emit('game:state', {
            board: room.state.board,
            currentTurn: room.state.currentTurn,
            winner: room.state.winner,
            isDraw: room.state.isDraw,
            lastMove: {
              userId: socket.id,
              move,
              mark
            }
          });
          
          console.log(`Move in room ${roomId} by ${socket.id}`);
        } catch (error) {
          socket.emit('game:error', 'Failed to process move');
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
          
          console.log(`Chat message in room ${roomId} by ${socket.id}`);
        } catch (error) {
          socket.emit('chat:error', 'Failed to send message');
        }
      });
      
      // Disconnect handler
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        
        // Leave all rooms
        for (const [roomId, room] of gameRooms.entries()) {
          if (room.players.includes(socket.id)) {
            // Remove player from room
            room.players = room.players.filter((id: string) => id !== socket.id);
            
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
    
    console.log('Socket.io initialized successfully');
    
    // API routes
    app.use("/Api", router);
    
    // Serve index.html for all other routes in production
    if (process.env.NODE_ENV === "production") {
      app.get("*", (_: Request, res: Response) => {
        res.sendFile(path.join(__dirname, "../dist/index.html"));
      });
    } else {
      app.get("/", (_: Request, res: Response) => {
        return res.status(200).json({ message: "API is running" });
      });
    }

    // Unknown route handler
    app.use((_: Request, res: Response) => res.status(404).send({ message: "Route not found" }));

    // Global error handler
    app.use((err: ErrorObject, _: Request, res: Response, __: NextFunction) => {
      const defaultErr: ErrorObject = {
        log: 'Express error handler caught unknown middleware error',
        status: 400,
        message: { err: 'An error occurred' },
      };
      
      // Ensure err is an object
      const errorObj = Object.assign({}, defaultErr, err);
      
      // Format the error message
      let errorMessage = errorObj.message;
      if (typeof errorMessage === 'string') {
        errorMessage = { err: errorMessage };
      } else if (Array.isArray(errorMessage)) {
        errorMessage = { err: errorMessage.join(', ') };
      } else if (!errorMessage || typeof errorMessage !== 'object') {
        errorMessage = { err: 'An unknown error occurred' };
      }
      
      // Log the error for debugging
      console.error('SERVER ERROR:', {
        log: errorObj.log,
        message: errorMessage,
        originalError: err
      });
      
      // Send response
      return res.status(errorObj.status || 500).json({
        success: false,
        error: errorMessage.err
      });
    });

    // Connect to database
    startDB();

    // For local development
    if (process.env.NODE_ENV !== "production") {
      const PORT = process.env.PORT || 4000;
      server.listen(PORT, () => console.log(`Server running on port ${PORT} with Socket.io`));
    }
  }).catch(error => {
    console.error('Error initializing server:', error);
    process.exit(1);
  });
} catch (error) {
  console.error('Server initialization error:', error);
  process.exit(1);
}

// For Vercel serverless functions
export default app;
