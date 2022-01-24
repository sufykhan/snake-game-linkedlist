import React,{useState} from 'react';
import "../Styles/Boards.css";

const Boards = () => {

  const BOARD_SIZE = 10;
  //const [board, setBoard] = React.useState(new Array(BOARD_SIZE).fill(0).map(()=>new Array(BOARD_SIZE).fill(0)));

  const createBoard = (boardSize) => {
      const board=[];
      let cnt=1;
      for(let i=0; i<boardSize; i++){
        const row=[];
        for(let j=0;j<boardSize; j++){
            row.push(cnt++);
        }
        board.push(row);
      }
      return board;
  }
  const [board, setBoard] =useState(createBoard(BOARD_SIZE));
  const [snakeCell,setSnakeCell] = useState(new Set([45]));
  return (
  <div className="board">
    {board.map((row, rowIndex) =>{
        return (
        <div className="row" key={rowIndex}>
            {row.map((cellValue) =>{
                return (
                <div className={`cell ${(snakeCell.has(cellValue))?'snake-cell':''}`} key={cellValue}>
                    {cellValue}
                </div>
                )
            })}
        </div>);
    })}
  </div>
  );
};

export default Boards;
