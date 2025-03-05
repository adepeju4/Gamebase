/* eslint-disable react/no-unknown-property */
import React, { useState, useEffect, useRef } from 'react';
import {
  BASE_POSITIONS,
  HOME_ENTRANCE,
  HOME_POSITIONS,
  PLAYERS,
  SAFE_POSITIONS,
  START_POSITIONS,
  STATE,
  COORDINATES_MAP,
  STEP_LENGTH,
  TURNING_POINTS
} from './constants.js';

import ludoBG from './ludo-bg.jpg';

function Ludo() {
  const [currentPositions, setCurrentPositions] = useState(
    structuredClone(BASE_POSITIONS)
  );

  const [diceValue, setDiceValue] = useState(1 + Math.floor(Math.random() * 6));
  const [currentTurn, setCurrentTurn] = useState(0);
  const [isDiceEnabled, setIsDiceEnabled] = useState(true);
  const [gameState, setGameState] = useState(STATE.DICE_NOT_ROLLED);
  const [moveInterval, setMoveInterval] = useState(null);
  const [count, setCount] = useState(0)
  const pieceRefs = useRef({
    P1: Array(4)
      .fill(null)
      .map(() => React.createRef()),
    P2: Array(4)
      .fill(null)
      .map(() => React.createRef()),
  });
  const [highlightedPieces, setHighlightedPieces] = useState([]);
  const currentPlayer = PLAYERS[currentTurn];
  const [isHighlighted, setIsHighlighted] = useState({
    P1: { 0: false, 1: false, 2: false, 3: false },
    P2: { 0: false, 1: false, 2: false, 3: false },
  });
  function handleStateChange(value) {
    setGameState(value);

    if (value === STATE.DICE_NOT_ROLLED) {
      enableDice();
      unhighlightPieces();
    } else {
      disableDice();
    }
  }

  const onDiceClick = () => {

    const newDiceValue = 1 + Math.floor(Math.random() * 6);


    setDiceValue(newDiceValue);

    setGameState(STATE.DICE_ROLLED);
  };

  const checkForEligiblePieces = () => {
    const player = currentTurn;

    // eligible pieces of given player
    const eligiblePieces = getEligiblePieces(PLAYERS[player]);

    if (eligiblePieces.length) {
      highlightPieces(player, eligiblePieces);
    } else {
      incrementTurn();
    }
  };

  const incrementTurn = () => {
    setCurrentTurn((prevTurn) => (prevTurn === 0 ? 1 : 0));
    setGameState(STATE.DICE_NOT_ROLLED)
  };

  const getEligiblePieces = (player) => {
    const result = [0, 1, 2, 3].filter((piece) => {
      const currentPosition = currentPositions[player][piece];

      if (currentPosition === HOME_POSITIONS[player]) {
        return false;
      }

      if (BASE_POSITIONS[player].includes(currentPosition) && diceValue !== 6) {
        return false;
      }

      if (
        HOME_ENTRANCE[player].includes(currentPosition) &&
        diceValue > HOME_POSITIONS[player] - currentPosition
      ) {
        return false;
      }

      return true;
    });


    return result;
  };

  const resetGame = () => {
    console.log('reset game');

    // Resetting current positions
    const newPositions = structuredClone(BASE_POSITIONS);
    setCurrentPositions(newPositions);

    // Reset the turn and game state
    setCurrentTurn(0);
    setGameState(STATE.DICE_NOT_ROLLED);
  };

  const enableDice = () => {
    setIsDiceEnabled(true);
  };

  const disableDice = () => {
    setIsDiceEnabled(false);
  };

  const highlightPieces = (player, pieces) => {
    setHighlightedPieces(pieces.map((piece) => `${player}-${piece}`));
  };

  const unhighlightPieces = () => {
    setHighlightedPieces([]);
  };

  // ... state hooks and other functions ...

  const onPieceClick = (event) => {
    const target = event.target;

    if (
      !target.classList.contains('player-piece') ||
      !target.classList.contains('highlight')
    ) {
      return;
    }


    const player = target.getAttribute('player-id');
    const piece = parseInt(target.getAttribute('piece'), 10);
    console.log(piece, 'piece clicked');
    handlePieceClick(player, piece);
  };
  const handlePieceClick = (player, piece) => {
    const currentPosition = currentPositions[player][piece];


    if (BASE_POSITIONS[player].includes(currentPosition)) {
      setPiecePosition(player, piece, START_POSITIONS[player]);
      setGameState(STATE.DICE_NOT_ROLLED);
      return;
    }

    unhighlightPieces();
    movePiece(player, piece, diceValue);
  };

  // const movePiece = (player, piece, moveBy) => {
  //   let stepsRemaining = moveBy;
  //   // Clear any existing interval
  //   if (moveInterval) {
  //     clearInterval(moveInterval);
  //   }

  //   const intervalId = setInterval(() => {

  //     incrementPiecePosition(player, piece);
  //     stepsRemaining--;


  //     if (stepsRemaining === 0) {
  //       clearInterval(intervalId);
  //       setMoveInterval(null); // Clear interval ID state

  //       if (hasPlayerWon(player)) {
  //         alert(`Player: ${player} has won!`);
  //         resetGame();
  //       } else {
  //         const isKill = checkForKill(player, piece);

  //         if (isKill || diceValue === 6) {
  //           setGameState(STATE.DICE_NOT_ROLLED);
  //         } else {
  //           incrementTurn();
  //         }
  //       }
  //     }

  //   }, 200);

  //   setMoveInterval(intervalId); // Set the new interval ID
  // };






  const movePiece = (player, piece, moveBy) => {
    const makeMove = (stepsRemaining) => {
      console.log(stepsRemaining, "steps remaininh")
      incrementPiecePosition(player, piece);
      stepsRemaining--;
  
      if (stepsRemaining > 0) {
        // Schedule the next move
        const timeoutId = setTimeout(() => makeMove(stepsRemaining), 200);
        setMoveInterval(timeoutId);  // Store the timeout ID for potential clearing
      } else {
        // Clear the timeout ID as movement is complete
        setMoveInterval(null);
  
        // Check for game state changes after the last move
        if (hasPlayerWon(player)) {
          alert(`Player: ${player} has won!`);
          resetGame();
        } else {
          const isKill = checkForKill(player, piece);
          if (isKill || diceValue === 6) {
            setGameState(STATE.DICE_NOT_ROLLED);
          } else {
            incrementTurn();
          }
        }
      }
    };

    makeMove(moveBy);
  };









  const checkForKill = (player, pieceIndex) => {
    const currentPosition = currentPositions[player][pieceIndex];
    const opponent = player === 'P1' ? 'P2' : 'P1';

    let kill = false;

    [0, 1, 2, 3].forEach((opponentPieceIndex) => {
      const opponentPosition = currentPositions[opponent][opponentPieceIndex];

      if (
        currentPosition === opponentPosition &&
        !SAFE_POSITIONS.includes(currentPosition)
      ) {
        setPiecePosition(
          opponent,
          opponentPieceIndex,
          BASE_POSITIONS[opponent][opponentPieceIndex]
        );
        kill = true;
      }
    });

    return kill;
  };
  const hasPlayerWon = (player) => {
    return [0, 1, 2, 3].every(
      (pieceIndex) =>
        currentPositions[player][pieceIndex] === HOME_POSITIONS[player]
    );
  };
  const incrementPiecePosition = (player, pieceIndex, currentPositions) => {
    const newPosition = getIncrementedPosition(player, pieceIndex, currentPositions);
    setPiecePosition(player, pieceIndex, newPosition);
  };



  useEffect(() => {
    console.log(count, "count")
  }, [count])



  //useEffect(()=>{console.log(currentPositions, "positions")}, [currentPositions])

  const setPiecePosition = (player, pieceIndex, newPosition) => {



   // setCount(prevCount => prevCount + 1); // Functional update for count

    if (currentPositions[player][pieceIndex] === newPosition) {
      return currentPositions;
    }
    const newPositions = { ...currentPositions };
    newPositions[player] = [...newPositions[player]];
    newPositions[player][pieceIndex] = newPosition;

    setCurrentPositions(newPositions);
  };

  const renderPiece = (player, index) => {
    const position = currentPositions[player][index];
    const [x, y] = COORDINATES_MAP[position];

    return (
      <div
        key={`${player}-${index}`}
        className={`player-piece ${player}-${index} ${
          isHighlighted[player][index] ? 'highlight' : ''
        }`}
        player-id={player}
        piece={index}
        onClick={(event) => onPieceClick(event)}
        ref={pieceRefs.current[player][index]}
        style={{ top: `${y * STEP_LENGTH}%`, left: `${x * STEP_LENGTH}%` }}
      />
    );
  };

  useEffect(() => {

    const newHighlightedState = {
      P1: { 0: false, 1: false, 2: false, 3: false },
      P2: { 0: false, 1: false, 2: false, 3: false },
    };

    highlightedPieces.forEach(piece => {
      const [player, index] = piece.split("-");
      if (newHighlightedState[PLAYERS[player]]) {
        newHighlightedState[PLAYERS[player]][index] = true;
      }
    });


    setIsHighlighted(newHighlightedState);
  }, [highlightedPieces]);

  function getIncrementedPosition(player, piece) {
    const currentPosition = currentPositions[player][piece];

    if (currentPosition === TURNING_POINTS[player]) {
      return HOME_ENTRANCE[player][0];
    } else if (currentPosition === 51) {
      return 0;
    }
    return currentPosition + 1;
  }

  useEffect(() => {
    PLAYERS.forEach((player) => {
      [0, 1, 2, 3].forEach((piece) => {
        const newPosition = currentPositions[player][piece];
        setPiecePosition(player, piece, newPosition);
      });
    });
  }, [currentPositions]);

  useEffect(() => {

    if (gameState === STATE.DICE_ROLLED) {
      checkForEligiblePieces();
    }
  }, [gameState]);

  useEffect(() => {
    Object.entries(currentPositions).forEach(([player, positions]) => {
      positions.forEach((position, index) => {

        setPiecePosition(player, index, position);
      });
    });
  }, [currentPositions]);

  useEffect(() => {
    // Cleanup function
    return () => {
      if (moveInterval) {
        clearInterval(moveInterval);
        setCount(0)
      }
    };
  }, [moveInterval]);

  return (
    <div className="ludo-container">
      <div className="ludo" style={{ backgroundImage: `url(${ludoBG})` }}>
        <div className="player-pieces">
          {Object.entries(currentPositions).map(([player, positions]) => {

            return positions.map((_, index) => renderPiece(player, index));
          })}
        </div>

        <div className="player-bases">
          {PLAYERS.map((player, index) => (
            <div
              key={player}
              className={`player-base ${
                index === currentTurn ? 'highlight' : ''
              }`}
              player-id={player}
            >
              {player}
            </div>
          ))}
        </div>
      </div>
      <div className="footer">
        <div className="row">
          <button
            id="dice-btn"
            className="btn btn-dice"
            disabled={!isDiceEnabled}
            onClick={onDiceClick}
          >
            Roll
          </button>
          <div className="dice-value">{diceValue}</div>
          <button id="reset-btn" className="btn btn-reset" onClick={resetGame}>
            Reset
          </button>
        </div>
        <h2 className="active-player">
          Active Player: <span>{currentPlayer}</span>
        </h2>
      </div>
    </div>
  );
}

export default Ludo;
