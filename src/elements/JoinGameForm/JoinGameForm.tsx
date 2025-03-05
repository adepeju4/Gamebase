import { Input } from "antd";
import React, { useState } from "react";

// eslint-disable-next-line react/prop-types
function JoinGameForm({ game, onCreateChannel, setRivals }) {
  const [rivalInputs, setRivalInputs] = useState([""]);
  const handleChangeSingle = (e) => {
    setRivals([e.target.value]);
  };
  const handleChangeMultiple = (index, value) => {
    const updatedRivals = [...rivalInputs];
    updatedRivals[index] = value;
    setRivalInputs(updatedRivals);
    setRivals(updatedRivals.filter(Boolean));
  };

  const addRivalInput = () => {
    setRivalInputs([...rivalInputs, ""]);
  };

  return (
    <div className="joinGame w-[100%] md:w-[60%] lg:w-[600px]  flex flex-col gap-4 text-medium">
      <label>Create Game</label>
      {game === "Tic Tac Toe" || game === "Chess" ? (
        <>
          <Input
            className="w-[80%]  md:w-[80%]"
            type="text"
            placeholder="Username of rival..."
            onChange={handleChangeSingle}
          />
          <button onClick={onCreateChannel} className="my-4">
            Join/Start Game
          </button>
        </>
      ) : (
        <>
          {rivalInputs.map((_, index) => (
            <Input
              key={index}
              className="w-[60%]  "
              type="text"
              placeholder="Username of rival..."
              onChange={(e) => handleChangeMultiple(index, e.target.value)}
            />
          ))}

          <div className="join--cta my-8 flex gap-8">
            <button type="button" onClick={addRivalInput}>
              Add Another Rival
            </button>
            <button onClick={onCreateChannel}>Join/Start Game</button>
          </div>
        </>
      )}
    </div>
  );
}

export default JoinGameForm;
