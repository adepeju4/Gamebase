import React from 'react';
import '../scss/_game.scss';

function CustomInput() {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <div className="str-chat__input-flat str-chat__input-flat--send-button-active">
      <div className="str-chat__input-flat-wrapper">
        <div className="str-chat__input-flat--textarea-wrapper">
          <textarea 
            className="str-chat__textarea"
            placeholder="Type your message"
          />
        </div>
        <button onClick={handleSubmit}> Send Message</button>
      </div>
    </div>
  );
}

export default CustomInput;
