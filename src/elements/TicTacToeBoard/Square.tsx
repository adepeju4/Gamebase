interface SquareProps {
  rivalTurn: boolean;
  value: string;
  row: number;
  square: number;
  onSquareClick: (row: number, square: number) => void;
}

function Square({ rivalTurn, value, row, square, onSquareClick }: SquareProps) {
  return (
    <button
      disabled={rivalTurn}
      className="square"
      onClick={() => {
        onSquareClick(row, square);
      }}
    >
      {value}
    </button>
  );
}

export default Square;
