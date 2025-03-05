import React, { useState } from 'react';
import '../scss/_game.scss';

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
    <div className="str-chat__input-flat str-chat__input-flat--send-button-active">
      <div className="str-chat__input-flat-wrapper">
        <div className="str-chat__input-flat--textarea-wrapper">
          <textarea 
            className="str-chat__textarea"
            placeholder="Type your message"
            value={message}
            onChange={handleChange}
          />
        </div>
        <button onClick={handleSubmit}> Send Message</button>
      </div>
    </div>
  );
}

export default CustomInput;
