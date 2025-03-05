
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStoreActions, useStoreState } from "easy-peasy";
import JoinGameForm from "../elements/JoinGameForm/JoinGameForm";
import BackButton from "../elements/BackButton";
import Modal from "../elements/Modal/Modal";
import { v4 as uuidv4 } from "uuid";
// import Cookies from "universal-cookie";
import Navbar from "./Navbar/Navbar";
import { StreamChat } from "stream-chat";

// const cookies = new Cookies();

interface JoinGameProps {
  client: StreamChat; 
}

function JoinGame({ client }: JoinGameProps) {
  const navigate = useNavigate();
  const [rivals, setRivals] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const activeGame = useStoreState((state: any) => state.activeGame);
  const setChannel = useStoreActions((actions: any) => actions.setChannel);

  const modalProps = {
    title: "Error",
    body: "",
    footer: "Close",
  };

  const onCreateChannel = async () => {
    try {
      const channelId = uuidv4();
      const newChannel = client.channel("gaming", channelId, {
        name: activeGame,
        members: [client.userID || ""],
      });

      await newChannel.create();
      setChannel(newChannel);

      // Query for rivals
      const queryPromises = rivals.map((rivalName: string) =>
        client.queryUsers({ name: rivalName })
      );

      const queryResults = await Promise.all(queryPromises);
      const rivalUsers = queryResults.flatMap((result) => result.users);

      if (rivalUsers.length) {
        await newChannel.addMembers(rivalUsers.map((user) => user.id));
      }

      navigate(`/${activeGame.toLowerCase().replace(/\s+/g, "-")}`);
    } catch (error) {
      setIsModalVisible(true);
      setError("Failed to create channel");
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
      <Navbar client={client} />
      <div className="joinGameContainer">
        <BackButton handleBackButton={handleBackButton} />
        <div className="joinGameContent">
          <h1>Join {activeGame} Game</h1>
          <JoinGameForm
            game={activeGame}
            onCreateChannel={onCreateChannel}
            setRivals={setRivals}
            client={client}
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
