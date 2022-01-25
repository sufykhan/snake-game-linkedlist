import React,{useState,useEffect} from 'react';
import "../Styles/Boards.css";
import {useInterval} from '../Components/Utils.js';


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
const BOARD_SIZE = 12;

const Direction = {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right'
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
  const [foodCell,setFoodCell]=useState(getFoodPosition(snakeCell));
  const [direction,setDirection]=useState(Direction.RIGHT);

  const moveSnake = () => {
      const currHeadCoordinate={row:snake.head.value.row,col:snake.head.value.col};
      const nextHeadCoordinate=getNextHeadCoordinate(currHeadCoordinate,direction);
      const nextHeadCell=board[nextHeadCoordinate.row][nextHeadCoordinate.col];
      
      const newCell={
            row:nextHeadCoordinate.row,
            col:nextHeadCoordinate.col,
            cell:nextHeadCell,
      }
      console.log(newCell);
      const newHead=new LinkedListNode(newCell);

      const currHead=snake.head;
      snake.head=newHead;
      currHead.next=newHead;

      const  newSnakeCells=new Set(snakeCell);
      newSnakeCells.add(nextHeadCell);
      newSnakeCells.delete(snake.tail.value.cell);

      snake.tail=snake.tail.next;

    if(snake.tail===null) snake.tail=snake.head;

      setSnakeCell(newSnakeCells);

  }
 
  useInterval(()=>{
        moveSnake();
  },2000);
 
  return (
  <div className="board">
    {board.map((row, rowIndex) =>{
        return (
        <div className="row" key={rowIndex}>
            {row.map((cellValue) =>{
                const classNameVal=getClassName(cellValue,foodCell,snakeCell);
                return (
                <div className={classNameVal} key={cellValue}>
                    {cellValue}
                </div>
                )
            })}
        </div>);
    })}
  </div>
  );
};

const getClassName = (cellValue,foodCell,snakeCell)=>{
    let className='cell'; 
    if(cellValue===foodCell){
         className='cell food-cell';
    }
    if(snakeCell.has(cellValue)){
        className='cell snake-cell';
    }
    return className;
}
export default Boards;

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

const getFoodPosition=(snakeCell)=>{
    let foodPosition=Math.floor(Math.random()*BOARD_SIZE*BOARD_SIZE);
    while(snakeCell.has(foodPosition)){
        foodPosition=Math.floor(Math.random()*BOARD_SIZE*BOARD_SIZE);
    }
    return foodPosition;
}

const getNextHeadCoordinate = (currHeadCoordinate,direction) => {
    let nextHeadCoordinate={row:null,col:null};
    if(direction===Direction.UP){
        nextHeadCoordinate.row=currHeadCoordinate.row-1;
        nextHeadCoordinate.col=currHeadCoordinate.col;
    }
    if(direction===Direction.RIGHT){
        nextHeadCoordinate.row=currHeadCoordinate.row;
        nextHeadCoordinate.col=currHeadCoordinate.col+1;
    }
    if(direction===Direction.LEFT){
        nextHeadCoordinate.row=currHeadCoordinate.row;
        nextHeadCoordinate.col=currHeadCoordinate.col-1;
    }
    if(direction===Direction.DOWN){
        nextHeadCoordinate.row=currHeadCoordinate.row+1;
        nextHeadCoordinate.col=currHeadCoordinate.col;
    }
    return nextHeadCoordinate;
}