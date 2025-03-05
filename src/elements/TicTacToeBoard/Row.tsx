/* eslint-disable react/prop-types */

import Square from "./Square";

interface RowProps {
  columns: string[];
  row: number;
  turn: boolean;
  onSquareClick: (row: number, square: number) => void;
  [key: string]: any;
}

function Row(props: RowProps) {
  return (
    <div className="row">
      {props.columns.map((text: string, index: number) => (
        <Square
          row={props.row}
          rivalTurn={props.turn}
          square={index}
          key={`rowSquare${index}`}
          value={text}
          onSquareClick={props.onSquareClick}
        />
      ))}
    </div>
  );
}

export default Row;
