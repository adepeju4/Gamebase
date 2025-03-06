import { useEffect, useState } from 'react';
import { useStoreState } from 'easy-peasy';
import Navbar from '../Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import MessageBox from '../MessageBox';
import { initializeSocket, joinGameRoom } from '../../socket/socketClient';

function TicTacToe() {
  const rivals = useStoreState((state: any) => state.rivals);
  const gameRoom = useStoreState((state: any) => state.gameRoom);
  const navigate = useNavigate();

  const [socket, setSocket] = useState<any>(null);
  const [playersJoined, setPlayersJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gameState, setGameState] = useState<any>({
    board: Array(3)
      .fill(null)
      .map(() => Array(3).fill(null)),
    currentTurn: null,
    winner: null,
  });

  useEffect(() => {
    // Initialize socket connection
    try {
      const socketInstance = initializeSocket();
      setSocket(socketInstance);

      // Join the game room if we have one
      if (gameRoom?.id) {
        joinGameRoom(gameRoom.id)
          .then(() => {
            console.log('Joined game room:', gameRoom.id);
          })
          .catch(err => {
            console.error('Error joining game room:', err);
            setError('Failed to join game room');
          });
      }

      // Listen for player updates
      socketInstance.on('room:players', (data: { players: string[]; currentTurn: string }) => {
        setPlayersJoined(data.players.length === 2);
        setGameState((prev: any) => ({
          ...prev,
          currentTurn: data.currentTurn,
        }));
      });

      // Listen for game state updates
      socketInstance.on('game:state', (data: any) => {
        setGameState({
          board:
            data.board ||
            Array(3)
              .fill(null)
              .map(() => Array(3).fill(null)),
          currentTurn: data.currentTurn,
          lastMove: data.lastMove,
        });
      });

      // Listen for errors
      socketInstance.on('room:error', (errorMsg: string) => {
        setError(errorMsg);
      });

      socketInstance.on('game:error', (errorMsg: string) => {
        setError(errorMsg);
      });

      return () => {
        // Clean up event listeners
        socketInstance.off('room:players');
        socketInstance.off('game:state');
        socketInstance.off('room:error');
        socketInstance.off('game:error');
      };
    } catch (err) {
      console.error('Socket connection error:', err);
      setError('Failed to connect to game server');
    }
  }, [gameRoom]);

  useEffect(() => {
    if (!gameRoom && !rivals.length) navigate('/');
  }, [gameRoom, rivals, navigate]);

  const rivalName = rivals[0];

  const handleMove = (row: number, col: number) => {
    if (!socket || !gameRoom || !playersJoined) return;

    // Send move to server
    socket.emit('game:move', {
      roomId: gameRoom.id,
      move: { rowIndex: row, columnIndex: col },
    });
  };

  if (!playersJoined || !gameRoom || !socket) {
    return (
      <div className="loading h-screen w-screen flex items-center justify-center">
        {error ? `Error: ${error}` : 'Waiting for other players to join...'}
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex">
        <div className="flex-1 flex items-center justify-center">
          <div className="game-board">
            <h2 className="text-2xl mb-4 text-center">Tic Tac Toe</h2>
            <p className="mb-4 text-center">Playing against: {rivalName}</p>

            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

            <div className="grid grid-cols-3 gap-2 w-64 mx-auto">
              {gameState.board.map((row: any[], rowIndex: number) => (
                <div key={`row-${rowIndex}`} className="flex">
                  {row.map((cell: string, colIndex: number) => (
                    <button
                      key={`cell-${rowIndex}-${colIndex}`}
                      className="w-20 h-20 bg-gray-200 flex items-center justify-center text-3xl font-bold"
                      onClick={() => handleMove(rowIndex, colIndex)}
                      disabled={!!cell || gameState.winner}
                    >
                      {cell}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            <p className="mt-4 text-center">
              {gameState.winner
                ? `Winner: ${gameState.winner === socket.id ? 'You' : rivalName}`
                : `Current turn: ${gameState.currentTurn === socket.id ? 'Your turn' : `${rivalName}'s turn`}`}
            </p>
          </div>
        </div>

        <MessageBox roomId={gameRoom.id} socket={socket} />
      </div>
    </div>
  );
}

export default TicTacToe;
