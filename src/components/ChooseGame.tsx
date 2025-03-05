import React, { useEffect } from "react";
import selectImg from "../assets/selectgame.svg";
import ludo from "../assets/ludo.svg";
import chess from "../assets/chess.svg";
import tictactoe from "../assets/tictactoe.svg";
import { useStoreActions } from "easy-peasy";
import { useStoreState } from "easy-peasy";

import Navbar from "./Navbar/Navbar";
import { StreamChat } from "stream-chat";
import { useNavigate } from "react-router-dom";

function ChooseGame() {
  const setGame = useStoreActions((state) => state.setActiveGame);
  const setGamePath = useStoreActions((state) => state.setActiveGamePath);
  const selectedGame = useStoreState((state) => state.activeGame);
  const client = StreamChat.getInstance(import.meta.env.VITE_KEY);

  const navigate = useNavigate();

  const gameOptions = [
    {
      gameImg: tictactoe,
      gameName: "Tic Tac Toe",
      path: "/tic-tac-toe",
    },
    {
      gameImg: chess,
      gameName: "Chess",
      path: "/chess",
    },
    {
      gameImg: ludo,
      gameName: "Ludo",
      path: "/ludo",
    },
  ];

  const colorScheme = [
    {
      imgBg: "#FFA800",
      borderBg: "#FF8A00",
      textBg: "#F3501D",
    },
    {
      imgBg: "#EB00FF",
      borderBg: "#FF00A8",
      textBg: "#7213EB",
    },
    {
      imgBg: "#391898",
      borderBg: "#843CE0",
      textBg: "#451CBB",
    },
  ];

  const handleActiveGame = (game, path) => {
    setGame(game);
    setGamePath(path);
  };

  useEffect(() => {
    if (selectedGame) {
      navigate("/join");
    }
  }, [selectedGame]);

  return (
    <>
      <Navbar client={client} />

      <div className="selectGame_wrapper">
        <header className="selectGame_header">
          <p className="selectgame-title">Select Game</p>

          <div className="gamePoints">
            <img src={selectImg} alt={"select game"} />
            <p className="gamePoints">0</p>
          </div>
        </header>

        <section className="gameList">
          {gameOptions.map((game, index) => (
            <div
              className="gameSelector"
              onClick={() => {
                handleActiveGame(game.gameName, game.path);
              }}
              key={`keykey${index}`}
            >
              <div
                className="game_img"
                style={{
                  background: colorScheme[index].imgBg,
                  border: `2px solid ${colorScheme[index].borderBg}`,
                }}
              >
                <img src={game.gameImg} alt={game.gameName} />
              </div>
              <div
                className="game_title"
                style={{
                  backgroundColor: colorScheme[index].textBg,
                  border: `2px solid ${colorScheme[index].borderBg}`,
                }}
              >
                {game.gameName}
              </div>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}

export default ChooseGame;
