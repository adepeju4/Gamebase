import  { useEffect, useState } from "react";
import Board from "../../elements/TicTacToeBoard/Board";
// Import Channel and Chat from stream-chat-react
// import { Channel, Chat } from "stream-chat-react";
import { useStoreState } from "easy-peasy";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { StreamChat } from "stream-chat";

import MessageBox from "../MessageBox";

function TicTacToe() {
  const client: StreamChat = StreamChat.getInstance(import.meta.env.VITE_KEY);
  const rivals = useStoreState((state: any) => state.rivals);
  const channel = useStoreState((state: any) => state.channel);
  const navigate = useNavigate();

  const [playersJoined, setPlayersJoined] = useState(
    channel?.state?.watcher_count === 2
  );

  useEffect(() => {
    if (!channel && !rivals.length) navigate("/");
  }, [channel, rivals, navigate]);

  const rivalName = rivals[0];

  channel?.on("user.watching.start", (event: any) => {
    setPlayersJoined(event.watcher_count === 2);
  });

  if (!playersJoined || !channel || !client) {
    return (
      <div className="loading h-screen w-screen flex items-center justify-center">
        Waiting for other players to join...
      </div>
    );
  }

  return (
    channel &&
    client && (
      <div className="h-screen w-screen flex">
        <Navbar client={client} />
        {/* Comment out Chat and Channel components but keep the structure */}
        {/* <Chat client={client} theme="messaging">
          <Channel channel={channel}> */}
            <Board channel={channel} rivalName={rivalName} />

            <MessageBox />

            {/* {LEAVE GAME BTN} */}
          {/* </Channel>
        </Chat> */}
      </div>
    )
  );
}

export default TicTacToe;
