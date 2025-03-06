import React, { useState } from 'react';
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter } from "../components/ui/card";

function CustomInput() {
  const [message, setMessage] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Message submitted:', message);
    setMessage('');
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-4">
          <Textarea 
            placeholder="Type your message"
            value={message}
            onChange={handleChange}
            className="min-h-[100px] resize-none"
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit">
            Send Message
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default CustomInput;
