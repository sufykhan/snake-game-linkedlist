import React,{useState,useEffect} from 'react';
import "../Styles/Boards.css";

const snakeStartPosition=(board)=>{
    const startingRow=Math.round(board.length/3);
    const startingCol=Math.round(board[0].length/3);
    const startingCell=board[startingRow][startingCol];
    const val={
          row:startingRow,
          col:startingCol,
          cell:startingCell,
    };
    return val;
}

class LinkedListNode{
    constructor(value){
        this.value=value;
        this.next=null;
    }
}
class SinglyLinkedList{
  constructor(value){
    const node = new LinkedListNode(value);
    this.head = node;
    this.tail = node;
  }
}
const BOARD_SIZE = 10;

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

const Boards = () => {

  
  const handleKeyDown = (e) => {
      console.log("Do something");
  }
  useEffect(()=>{
    window.addEventListener('keydown', e=>{handleKeyDown(e)});
  },[])

  const [board, setBoard] =useState(createBoard(BOARD_SIZE));
 
 const [snake,setSnake]=useState(new SinglyLinkedList(snakeStartPosition(board)));

  const [snakeCell,setSnakeCell] = useState(new Set([snake.head.value.cell]));
  
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
