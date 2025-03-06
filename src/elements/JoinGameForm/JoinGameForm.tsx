import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

interface JoinGameFormProps {
  game: string | null;
  onCreateGameRoom: () => Promise<void>;
  setRivals: React.Dispatch<React.SetStateAction<string[]>>;
}

function JoinGameForm({ onCreateGameRoom, setRivals }: JoinGameFormProps) {
  const [rivalName, setRivalName] = useState("");

  const handleChangeSingle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRivalName(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rivalName) {
      setRivals([rivalName]);
      onCreateGameRoom();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="join-game-form">
      <div className="form-group">
        <label htmlFor="rivalName">Rival's Username</label>
        <Input
          type="text"
          id="rivalName"
          placeholder="Enter rival's username"
          value={rivalName}
          onChange={handleChangeSingle}
          required
        />
      </div>
      <Button type="submit" className="submit-button">
        Start Game
      </Button>
    </form>
  );
}

export default JoinGameForm;
