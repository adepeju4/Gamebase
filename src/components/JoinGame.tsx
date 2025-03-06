import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {  useStoreState } from "easy-peasy";
import JoinGameForm from "../elements/JoinGameForm/JoinGameForm";
import BackButton from "../elements/BackButton";
import Modal from "../elements/Modal/Modal";
import Navbar from "./Navbar/Navbar";
import { createGameRoom } from "../socket/socketClient";

interface JoinGameProps {}

function JoinGame({}: JoinGameProps) {
  const navigate = useNavigate();
  const [rivals, setRivals] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const activeGame = useStoreState((state: any) => state.activeGame);

  const modalProps = {
    title: "Error",
    body: "",
    footer: "Close",
  };

  const onCreateGameRoom = async () => {
    try {
      await createGameRoom(activeGame || 'Unknown Game', rivals);
      navigate(`/${activeGame?.toLowerCase().replace(/\s+/g, "-")}`);
    } catch (error: any) {
      setIsModalVisible(true);
      setError(error.message || "Failed to create game room");
    }
  };

  const handleBackButton = () => {
    navigate("/");
  };

  useEffect(() => {
    try {
      if (!activeGame) {
        navigate("/");
      }
    } catch (error: any) {
      modalProps.body = error.message;
      setError(error.message);
      setIsModalVisible(true);
    }
  }, [activeGame, navigate]);

  return (
    <>
      <Navbar />
      <div className="joinGameContainer">
        <BackButton handleBackButton={handleBackButton} />
        <div className="joinGameContent">
          <h1>Join {activeGame} Game</h1>
          <JoinGameForm
            game={activeGame}
            onCreateGameRoom={onCreateGameRoom}
            setRivals={setRivals}
          />
        </div>
        {isModalVisible && (
          <Modal
            title={modalProps.title}
            body={error || modalProps.body}
            footer={modalProps.footer}
            setOpenModal={setIsModalVisible}
          />
        )}
      </div>
    </>
  );
}

export default JoinGame;
