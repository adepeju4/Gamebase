
import {
  Window,
  MessageList,
  MessageInput,
  ChannelHeader
} from "stream-chat-react";

function MessageBox() {
  return (
    <div className="backdrop-blur-sm bg-white/80 flex-[.3] h-full rounded-xl items-center overflow-hidden">
      <Window>
        <ChannelHeader />
        <MessageList />
        <MessageInput />
      </Window>
    </div>
  );
}

export default MessageBox;
