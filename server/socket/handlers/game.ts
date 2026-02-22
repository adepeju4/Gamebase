import { Server, Socket } from 'socket.io';

export const registerGameHandlers = (io: Server, socket: Socket, gameRooms: Map<string, any>) => {
  const { userId, userName } = socket.data.user;

  socket.on('room:create', data => {
    try {
      const { gameType, rivals } = data;
      const roomId = `${gameType}_${Date.now()}_${userId}`;

      gameRooms.set(roomId, {
        id: roomId,
        gameType,
        creator: userId,
        players: [userId],
        rivals,
        state: {
          board: Array(3)
            .fill(null)
            .map(() => Array(3).fill(null)),
          currentTurn: userId,
          moves: [],
        },
        createdAt: new Date(),
      });

      socket.join(roomId);
      socket.emit('room:created', { roomId });

      console.log(`Room created: ${roomId} by ${userName}`);
    } catch {
      socket.emit('room:error', 'Failed to create room');
    }
  });

  socket.on('room:join', data => {
    try {
      const { roomId } = data;
      const room = gameRooms.get(roomId);

      if (!room) {
        return socket.emit('room:error', 'Room not found');
      }

      if (!room.players.includes(userId)) {
        room.players.push(userId);
      }

      socket.join(roomId);

      io.to(roomId).emit('room:players', {
        players: room.players,
        currentTurn: room.state.currentTurn,
      });

      console.log(`User ${userName} joined room ${roomId}`);
    } catch {
      socket.emit('room:error', 'Failed to join room');
    }
  });

  socket.on('game:move', data => {
    try {
      const { roomId, move } = data;
      const room = gameRooms.get(roomId);

      if (!room) {
        return socket.emit('game:error', 'Room not found');
      }

      if (room.state.currentTurn !== userId) {
        return socket.emit('game:error', 'Not your turn');
      }

      const { rowIndex, columnIndex } = move;
      if (room.state.board[rowIndex][columnIndex] !== null) {
        return socket.emit('game:error', 'Invalid move');
      }

      const mark = room.players.indexOf(userId) === 0 ? 'X' : 'O';
      room.state.board[rowIndex][columnIndex] = mark;
      room.state.moves.push({ userId, move, mark, timestamp: new Date() });

      const board: (string | null)[][] = room.state.board;

      // Check for win
      let winner: string | null = null;
      for (let i = 0; i < 3; i++) {
        if (board[i][0] && board[i][0] === board[i][1] && board[i][0] === board[i][2])
          winner = userId;
        if (board[0][i] && board[0][i] === board[1][i] && board[0][i] === board[2][i])
          winner = userId;
      }
      if (board[0][0] && board[0][0] === board[1][1] && board[0][0] === board[2][2])
        winner = userId;
      if (board[0][2] && board[0][2] === board[1][1] && board[0][2] === board[2][0])
        winner = userId;

      // Check for draw
      const isDraw = !winner && board.every(row => row.every(cell => cell !== null));

      if (winner) {
        room.state.winner = winner;
      } else if (isDraw) {
        room.state.isDraw = true;
      } else {
        const otherPlayers = room.players.filter((id: string) => id !== userId);
        if (otherPlayers.length > 0) {
          room.state.currentTurn = otherPlayers[0];
        }
      }

      io.to(roomId).emit('game:state', {
        board: room.state.board,
        currentTurn: room.state.currentTurn,
        winner: room.state.winner,
        isDraw: room.state.isDraw,
        lastMove: { userId, move, mark },
      });

      console.log(`Move in room ${roomId} by ${userName}`);
    } catch {
      socket.emit('game:error', 'Failed to process move');
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${userName} (${userId})`);

    for (const [roomId, room] of gameRooms.entries()) {
      if (room.players.includes(userId)) {
        room.players = room.players.filter((id: string) => id !== userId);

        if (room.players.length === 0) {
          gameRooms.delete(roomId);
          console.log(`Room ${roomId} deleted (empty)`);
        } else {
          io.to(roomId).emit('room:players', {
            players: room.players,
            currentTurn: room.state.currentTurn,
          });
        }
      }
    }
  });
};
