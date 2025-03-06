import { io, Socket } from 'socket.io-client';
import Cookies from 'universal-cookie';
import store from '../lib/store';

let socket: Socket | null = null;

// Get the base URL from the current window location
const getBaseUrl = () => {
  const { protocol, hostname } = window.location;
  const port = process.env.NODE_ENV === 'production' ? '' : ':4000';
  return `${protocol}//${hostname}${port}`;
};

// Initialize socket connection
export const initializeSocket = (): Socket => {
  if (socket) return socket;

  const cookies = new Cookies();
  const token = cookies.get('token');
  
  if (!token) {
    throw new Error('Authentication token not found');
  }

  socket = io(getBaseUrl(), {
    auth: {
      token
    },
    transports: ['websocket', 'polling']
  });

  // Set up event listeners
  socket.on('connect', () => {
    console.log('Socket connected');
    store.getActions().setSocketConnected(true);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
    store.getActions().setSocketConnected(false);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  return socket;
};

// Disconnect socket
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
    store.getActions().setSocketConnected(false);
  }
};

// Get the socket instance
export const getSocket = (): Socket => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

// Create a game room
export const createGameRoom = (gameType: string, rivals: string[]): Promise<string> => {
  return new Promise((resolve, reject) => {
    const socket = getSocket();
    
    socket.emit('room:create', { gameType, rivals });
    
    socket.once('room:created', (data: { roomId: string }) => {
      // Store the room in the global state
      store.getActions().setGameRoom({
        id: data.roomId,
        name: gameType,
        players: [],
        rivals
      });
      resolve(data.roomId);
    });
    
    socket.once('room:error', (error: string) => {
      reject(new Error(error));
    });
  });
};

// Join a game room
export const joinGameRoom = (roomId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const socket = getSocket();
    
    socket.emit('room:join', { roomId });
    
    socket.once('room:players', () => {
      resolve();
    });
    
    socket.once('room:error', (error: string) => {
      reject(new Error(error));
    });
  });
};

// Make a game move
export const makeGameMove = (roomId: string, move: any): void => {
  const socket = getSocket();
  socket.emit('game:move', { roomId, move });
};

// Send a chat message
export const sendChatMessage = (roomId: string, text: string): void => {
  const cookies = new Cookies();
  const userName = cookies.get('userName');
  
  const socket = getSocket();
  socket.emit('chat:message', { 
    roomId, 
    message: {
      text,
      sender: userName,
      timestamp: new Date()
    } 
  });
};

export default {
  initializeSocket,
  disconnectSocket,
  getSocket,
  createGameRoom,
  joinGameRoom,
  makeGameMove,
  sendChatMessage
}; 