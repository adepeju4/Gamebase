import { useEffect } from "react";
import selectImg from "../assets/selectgame.svg";
import ludo from "../assets/ludo.svg";
import chess from "../assets/chess.svg";
import tictactoe from "../assets/tictactoe.svg";
import { useStoreActions } from "easy-peasy";
import { useStoreState } from "easy-peasy";

import Navbar from "./Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import GameCard from "../elements/GameCard";

function ChooseGame() {
  const setGame = useStoreActions((state) => state.setActiveGame);
  const setGamePath = useStoreActions((state) => state.setActiveGamePath);
  const selectedGame = useStoreState((state) => state.activeGame);

  const navigate = useNavigate();

  const gameOptions = [
    {
      gameImg: tictactoe,
      gameName: "Tic Tac Toe",
      description: "Classic game of X's and O's",
      path: "/tic-tac-toe",
    },
    {
      gameImg: chess,
      gameName: "Chess",
      description: "Strategic board game of kings and queens",
      path: "/chess",
    },
    {
      gameImg: ludo,
      gameName: "Ludo",
      description: "Fun board game of dice and tokens",
      path: "/ludo",
    },
  ];

  const handleActiveGame = (game: string, path: string) => {
    setGame(game);
    setGamePath(path);
  };

  useEffect(() => {
    if (selectedGame) {
      navigate("/join");
    }
  }, [selectedGame]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-white">Select Game</h1>

          <div className="flex items-center gap-4">
            <img src={selectImg} alt={"select game"} className="w-12 h-12" />
            <p className="text-2xl font-bold text-white">0</p>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {gameOptions.map((game, index) => (
            <div
              key={`game-${index}`}
              onClick={() => {
                handleActiveGame(game.gameName, game.path);
              }}
            >
              <GameCard
                title={game.gameName}
                description={game.description}
                imageSrc={game.gameImg}
                path={game.path}
              />
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

export default ChooseGame;
