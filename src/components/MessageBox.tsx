import React from "react";
import {
  Window,
  MessageList,
  MessageInput,
  ChannelHeader,

  // useMessageContext,
  // useMessageInputContext,
  // SendIconV2,
} from "stream-chat-react";
// import { cn } from "@/lib/utils";
// import { useStoreState } from "easy-peasy";
// import { Input } from "@/components/ui/input";
// import { Button } from "./ui/button";

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

// const CustomMessage = () => {
//   const userId = useStoreState((state) => state.user)?.me?.id;
//   const { message } = useMessageContext();

//   return (
//     <div
//       className={cn(
//         "flex w-max max-w-[75%] flex-col gap-2 my-1 rounded-lg px-3 py-2 text-sm",
//         message.user.id === userId
//           ? "ml-auto bg-white"
//           : "bg-gray-800 text-white"
//       )}
//     >
//       {message.text}
//     </div>
//   );
// };

// const CustomInput = () => {
//   const { text, setText, handleSubmit } = useMessageInputContext();

//   return (
//     <form
//       onSubmit={(event) => {
//         event.preventDefault();
//         handleSubmit(event);
//       }}
//       className="flex w-full items-center space-x-2 p-4"
//     >
//       <Input
//         id="message"
//         placeholder="Type your message..."
//         className="flex-1"
//         autoComplete="off"
//         value={text}
//         onChange={(event) => setText(event.target.value)}
//       />
//       <Button type="submit" size="icon" disabled={text.length === 0}>
//         <SendIconV2 className="h-4 w-4" />
//         <span className="sr-only">Send</span>
//       </Button>
//     </form>
//   );
// };

export default MessageBox;
