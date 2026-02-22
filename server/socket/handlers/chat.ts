import { Server, Socket } from 'socket.io';

export const registerChatHandlers = (io: Server, socket: Socket, gameRooms: Map<string, any>) => {
  const { userId, userName } = socket.data.user;

  socket.on('chat:message', data => {
    try {
      const { roomId, message } = data;
      const room = gameRooms.get(roomId);

      if (!room) {
        return socket.emit('chat:error', 'Room not found');
      }

      io.to(roomId).emit('chat:message', {
        ...message,
        id: `${Date.now()}_${userId}`,
        sender: userName,
      });

      console.log(`Chat message in room ${roomId} by ${userName}`);
    } catch {
      socket.emit('chat:error', 'Failed to send message');
    }
  });
};
