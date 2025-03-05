import { useState, useEffect } from "react";
import { useChatContext } from "stream-chat-react";
import Rukia from "@/assets/randomPlayerImages/rukia.jpeg";
import Ichigo from "@/assets/randomPlayerImages/ichigo.jpeg";
import Modal from "../Modal/Modal";
import Row from "./Row";
import { Avatar, Tooltip } from "antd";

import { v4 as uuidv4 } from "uuid";
import { useStoreActions, useStoreState } from "easy-peasy";


// Define types for the game state
interface GameState {
  rows: string[][];
  winner: string;
  turn: string;
  player: string;
}

// Define types for the Board component props
interface BoardProps {
  channel: any; // Using any temporarily to resolve type issues
  rivalName: string;
}

// Define types for move events
interface MoveEvent {
  type: string;
  data?: {
    rowIndex: number;
    columnIndex: number;
    winner?: boolean;
    player?: string;
    id?: string;
    isBoardFull?: boolean;
    turn?: string;
    rows?: string[][];
  };
}



function checkWin(rows: string[][]): number[] | undefined {
  const combos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
  ];

  const flattened = rows.reduce((acc: string[], row: string[]) => acc.concat(row), []);

  return combos.find(
    (combo) =>
      flattened[combo[0]] !== "" &&
      flattened[combo[0]] === flattened[combo[1]] &&
      flattened[combo[1]] === flattened[combo[2]]
  );
}

const getInitState = (creator: boolean, starter?: string): GameState => {
  const initState: GameState = {
    rows: [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ],
    winner: "",
    turn: starter || "X",
    player: creator ? "X" : "O",
  };
  return initState;
};

function Board({ channel, rivalName }: BoardProps) {
  const { client } = useChatContext();
  const isGameCreator = channel.state.members[client.userID].role === "owner";
  const processedEventUUIDs = new Set<string>();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [showRivalTurn, setShowRivalTurn] = useState<boolean>(false);
  const [gameOutcome, setGameOutcome] = useState<string>("");
  const updateGameStats = useStoreActions((actions) => actions.setGameStat);

  const [rivalMessage, setrivalMessage] = useState<string>("");

  const [gameState, setGameState] = useState<GameState>(getInitState(isGameCreator, "X"));

  const nextMove: Record<string, string> = { X: "O", O: "X" };

  const gameMessage: Record<string, string> = {
    win: "Yay, you won!🎉🎉🎉🎉🎉",
    loss: "Sorry, you lost this round 🫠",
    draw: "Welp, it's a draw. Try again? 🤔",
  };

  const callModal = () => {
    const modalProps = {
      title: gameMessage[gameOutcome as keyof typeof gameMessage] || "",
      body: "You can still continue with your partner, or leave the game",
      dispatch: isModalVisible,
      setDispatch: setIsModalVisible,
    };
    return modalProps;
  };

  const handlePlayerMove = (rowIndex: number, columnIndex: number) => {
    if (
      rowIndex >= 0 &&
      rowIndex < gameState.rows.length &&
      columnIndex >= 0 &&
      columnIndex < gameState.rows[rowIndex].length
    ) {
      if (gameState.rows[rowIndex][columnIndex] !== "" || gameState.winner) {
        // Cell is already filled or the game has ended
        return;
      }

      const newRows = [...gameState.rows];

      newRows[rowIndex][columnIndex] = gameState.player;

      
      const nextPlayer = nextMove[gameState.turn];

      const isBoardFull = gameState.rows.flat().every((cell) => cell !== "");

      const winner = checkWin(newRows);

      if (winner) {
        setGameOutcome("win");
        setIsModalVisible(true);
      } else if (!winner && isBoardFull) {
        setGameOutcome("draw");
        setIsModalVisible(true);
      }

    

      setGameState((prev) => {
        return {
          ...prev,
          rows: newRows,
          winner: winner ? gameState.player : "",
          turn: nextPlayer,
        };
      });
     
      const eventId = uuidv4();
      processedEventUUIDs.add(eventId);

      channel.sendEvent({
        type: "move",
        data: {
          id: eventId,
          turn: nextPlayer,
          winner: winner ? gameState.player : null,
          isBoardFull,
          rowIndex,
          columnIndex,
          rows: newRows,
          player: gameState.player,
        },
      });
      setShowRivalTurn(true);
    }
  };
  const applyOpponentMove = (move: MoveEvent) => {
    const {
      type,
      data,
    } = move;

    if (type === "move") {
      if (data) {
        const {
          winner,
          player,
          turn,
          rows,
          id,
          isBoardFull,
        } = data;

        if (player && player === gameState.player) return;

        // First, check if the event ID has already been processed
        if (id && processedEventUUIDs.has(id)) {
          return; // Stop processing if it's a duplicate
        }

        if (winner) {
          setGameOutcome("loss");
          setIsModalVisible(true);

          if (id) processedEventUUIDs.add(id);

          
          const nextStarter = gameState.player === "X" ? "O" : "X";
          resetGame(nextStarter); 

          return;
        }

        if (isBoardFull && !winner) {
          setGameOutcome("draw");
          setIsModalVisible(true);

          if (id) processedEventUUIDs.add(id);
          return;
        }

      
        if (
          gameState.rows[data.rowIndex][data.columnIndex] === "" &&
          player !== gameState.player
        ) {
        

          setGameState((prev) => {
            return { 
              ...prev, 
              winner: winner ? "" : prev.winner, 
              turn: turn || prev.turn, 
              rows: rows || prev.rows 
            };
          });

        
          if (id) processedEventUUIDs.add(id);
          setShowRivalTurn(false);
        }
      }
    } else if (type === "reset-game") {
      resetGame(null);
    }
  };

  const resetGame = (nextStarter: string | null = null) => {
    const starter = nextStarter ? nextStarter : isGameCreator ? "X" : "O";
    setGameState(getInitState(isGameCreator, starter));
  };

  const handleGameReset = () => {
    const nextStarter =
      gameOutcome === "loss"
        ? gameState.player
        : gameState.player === "X"
        ? "O"
        : "X";
    resetGame(nextStarter);
    setGameOutcome("");
    setrivalMessage("");
    setIsModalVisible(false);

    channel.sendEvent({
      type: "reset-game",
    });
  };

  useEffect(() => {
    const handleChannelEvent = (event: any) => {
      if (event.type === "move") {
        applyOpponentMove(event);
      } else if (event.type === "reset-game") {
        resetGame(null);
      }
    };

    channel.on(handleChannelEvent);

    return () => channel.off("messaging", handleChannelEvent);
  }, [channel]);

  const handleGameOutcome = (outcome: string) => {
    const gameId = channel.id;
    updateGameStats({ gameId, statType: outcome });
  };

  useEffect(() => {
    if (!gameOutcome) return; 

    let message = "";
    let outcomeType = "";
    switch (gameOutcome) {
      case "win":
        outcomeType = "win";
        message = "😭";
        break;
      case "draw":
        outcomeType = "draw";
        message = "🤔 let's go again!";
        break;
      case "loss":
        outcomeType = "loss";
        message = "🤣🤣";
        break;
      default:
        message = ""; // Default message or state
    }

    // Update the rival message based on the outcome
    setrivalMessage(message);

    // Update the game stats in the global store
    if (outcomeType) {
      handleGameOutcome(outcomeType);
    }
  }, [gameOutcome, updateGameStats]); // Ensure to include all necessary dependencies

  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      // Perform cleanup
      channel.off("messaging");
    });
  }

  if (import.meta.hot) {
    import.meta.hot.accept(() => {
      window.location.reload();
    });
  }

  useEffect(() => {
    setGameState(getInitState(isGameCreator, gameState.turn));
  }, []);
  return (
    <div className="flex-[.7] p-8 flex flex-col justify-center items-center h-full">
      <div>
        <Avatar size={64} src={Rukia} />
        <h3 className="text-center text-white text-large">
          {client?.user?.name} (Me)
        </h3>
      </div>

      <div className="board" id={"board"}>
        {(gameState.rows || []).map((row, rowIndex) => (
          <Row
            turn={showRivalTurn}
            key={rowIndex}
            columns={row}
            row={rowIndex}
            rowIndex={rowIndex}
            onSquareClick={handlePlayerMove}
          />
        ))}

        <GameStats gameId={channel.id} />
        <button onClick={handleGameReset}>Reset board</button>
      </div>
      <div>
        <Tooltip
          placement="right"
          title={rivalMessage || "My Turn"}
          color="white"
          open={showRivalTurn}
        >
          <Avatar size={64} src={Ichigo} />
          <h3 className="text-center text-white text-large">{rivalName}</h3>
        </Tooltip>
      </div>
      {/* <div className="playerScreen">
        <div className="scoreBoard">
          <div className="playerScore">{`${client.user.name}: ${playerPoints}`}</div>
          <div
            className="rivalScore"
            ref={rivalPoints}
          >{`${rivalName}: ${0}`}</div>
        </div>
        <button id="reset" onClick={handleResetBoard}>
          Reset board
        </button>
      </div> */}

      {isModalVisible && <Modal {...callModal()} />}
    </div>
  );
}

interface GameStatsProps {
  gameId: string;
}

const GameStats = ({ gameId }: GameStatsProps) => {
  const gameStats = useStoreState(
    (state) => state.gameStats[gameId] || { wins: 0, losses: 0, draws: 0 }
  );

  return (
    <div>
      <p>Wins: {gameStats.wins}</p>
      <p>Losses: {gameStats.losses}</p>
      <p>Draws: {gameStats.draws}</p>
    </div>
  );
};

export default Board;
