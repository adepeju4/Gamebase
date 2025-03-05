/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";

import { useDispatchComp } from "../lib/hooks";
import Modal from "../elements/Modal/Modal";

import JoinGameForm from "../elements/JoinGameForm/JoinGameForm";
import { useStoreActions, useStoreState } from "easy-peasy";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar/Navbar";

function JoinGame({ client }) {
  const selectedGame = useStoreState((state) => state.activeGame);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const activeGame = useStoreState((state) => state.activeGame);
  const activeGamePath = useStoreState((state) => state.activeGamePath);
  const channel = useStoreState((state) => state.channel);
  const setChannel = useStoreActions((actions) => actions.setChannel);

  const rivals = useStoreState((state) => state.rivals);
  const setRivals = useStoreActions((state) => state.setRivals);

  const modalProps = {
    title: ":( Opps!",
    body: rivals.includes(client?.user?.name)
      ? "You cannot play with yourself :)"
      : `User ${rivals[0]} not found...`,
    dispatch: error,
    setDispatch: setError,
  };

  const createChannel = async () => {
    try {
      const queryPromises = rivals.map((rivalName) =>
        client.queryUsers({ name: { $eq: rivalName } })
      );

      const responses = await Promise.all(queryPromises);

      const foundUsers = responses
        .map((response) => response.users[0])
        .filter(Boolean);

      if (foundUsers.length > 0) {
        const memberIds = foundUsers.map((user) => user.id);
        memberIds.push(client.userID);

        const newChannel = await client.channel("messaging", {
          image:
            "https://getstream.io/random_svg/?id=blue-sand-2&name=Blue+Sand",
          name: activeGame,
          members: memberIds,
        });

        await newChannel.watch();
        setChannel(newChannel);
        navigate(activeGamePath);
      } else {
        setError(true);
      }
    } catch (error) {
      console.log(error);
      modalProps.body = error.message;
      setError(error.message);
    }
  };

  useEffect(() => {
    if (!activeGame) {
      navigate("/");
    }
  }, [channel]);

  return (
    <>
      <Navbar client={client} />

      <div className="h-full w-full flex items-center justify-center p-8">
        <JoinGameForm
          game={selectedGame}
          client={client}
          onCreateChannel={createChannel}
          rivals={rivals}
          setRivals={setRivals}
        />
      </div>

      {error && useDispatchComp(Modal, modalProps)}
    </>
  );
}

export default JoinGame;
