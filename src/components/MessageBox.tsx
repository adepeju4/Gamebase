import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Socket } from 'socket.io-client';
import Cookies from 'universal-cookie';

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
}

interface MessageBoxProps {
  roomId?: string;
  socket?: Socket;
}

function MessageBox({ roomId, socket }: MessageBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const cookies = new Cookies();
  const userName = cookies.get('userName');

  useEffect(() => {
    if (!socket || !roomId) return;

    // Listen for new messages
    socket.on('chat:message', (message: Message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    return () => {
      socket.off('chat:message');
    };
  }, [socket, roomId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !roomId) return;

    const message = {
      text: newMessage,
      sender: userName,
      timestamp: new Date(),
    };

    // Send message to server
    socket.emit('chat:message', { roomId, message });

    // Clear input
    setNewMessage('');
  };

  return (
    <Card className="backdrop-blur-sm bg-white/80 flex-[.3] h-full rounded-xl overflow-hidden">
      <CardContent className="p-4 h-full flex flex-col">
        <div className="border-b pb-2 mb-4">
          <h3 className="text-lg font-semibold">Chat</h3>
        </div>

        <div className="flex-1 overflow-y-auto mb-4">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center">No messages yet</p>
          ) : (
            messages.map(msg => (
              <div
                key={msg.id}
                className={`mb-2 p-2 rounded-lg ${
                  msg.sender === userName ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
                } max-w-[80%]`}
              >
                <div className="font-semibold text-sm">{msg.sender}</div>
                <div>{msg.text}</div>
                <div className="text-xs text-gray-500">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={!socket || !roomId}
          />
          <Button type="submit" disabled={!socket || !roomId}>
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default MessageBox;
