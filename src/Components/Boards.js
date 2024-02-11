import React, {useState, useEffect} from "react";
import "../Styles/Boards.css";
import {useInterval} from "../Components/Utils.js";

class LinkedListNode {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class SinglyLinkedList {
    constructor(value) {
        const node = new LinkedListNode(value);
        this.head = node;
        this.tail = node;
    }
}

const BOARD_SIZE = 20;

const Direction = {
    UP: "up",
    DOWN: "down",
    LEFT: "left",
    RIGHT: "right",
};

const Boards = () => {
    useEffect(() => {
        window.addEventListener("keydown", (e) => {
            handleKeyDown(e);
        });
    }, []);

    const [board, setBoard] = useState(createBoard(BOARD_SIZE));
    const [snake, setSnake] = useState(
        new SinglyLinkedList(snakeStartPosition(board))
    );
    const [snakeCell, setSnakeCell] = useState(new Set([snake.head.value.cell]));
    const [foodCell, setFoodCell] = useState(getFoodPosition(snakeCell));
    const [direction, setDirection] = useState(Direction.RIGHT);
    const [score, setScore] = useState(0);
    const [maxscore, setMaxScore] = useState(0);

    const reverseLinkedList = () => {
        // [tail]->[x]->[y]->[head]->nullptr;
        snake.head = snake.tail;
        let currTail = snake.tail;
        let prev = null;
        let nextVal = null;

        while (currTail !== null) {
            nextVal = currTail.next;
            currTail.next = prev;
            prev = currTail;
            currTail = nextVal;
        }
        snake.tail = prev;
        if (direction === Direction.LEFT) {
            setDirection(Direction.RIGHT);
        } else if (direction === Direction.UP) {
            setDirection(Direction.DOWN);
        } else if (direction === Direction.DOWN) {
            setDirection(Direction.UP);
        } else if (direction === Direction.RIGHT) {
            setDirection(Direction.LEFT);
        }
    };

    const produceNewFoodPosition = () => {
        let newFoodPosition = Math.floor(Math.random() * (BOARD_SIZE * BOARD_SIZE));
        while (snakeCell.has(newFoodPosition)) {
            newFoodPosition = Math.floor(Math.random() * (BOARD_SIZE * BOARD_SIZE));
        }
        if(score%3===0){
            setDelay(delay+10);
        }
        return newFoodPosition;
    };
    const growTheSnake = (prevHeadCoordinate, foodCell) => {
        if (snake.head !== snake.tail && foodCell % 3 === 0) {
            reverseLinkedList();
            setScore(score+1);
            return;
        }
        let val = {
            row: prevHeadCoordinate.row,
            col: prevHeadCoordinate.col,
            cell: board[prevHeadCoordinate.row][prevHeadCoordinate.col],
        };
        let newTail = new LinkedListNode(val);

        let currTail = snake.tail;
        snake.tail = newTail;
        snake.tail.next = currTail;

        snakeCell.add(newTail.value.cell);
        setScore(score+1);
        setSnakeCell(snakeCell);
    };
    const gameOver = () => {
        setSnake(new SinglyLinkedList(snakeStartPosition(board)));
        setFoodCell(produceNewFoodPosition());
        snakeCell.clear();
        if(score>maxscore){
            setMaxScore(score);
        }
        setScore(0);
        setDelay(0);
        //setSnakeCell(new Set([snake.head.value.cell]));
        setPause(!pause);
    };

    const moveSnake = () => {
        const currHeadCoordinate = {
            row: snake.head.value.row,
            col: snake.head.value.col,
        };
        const currTailCoordinate = {
            row: snake.tail.value.row,
            col: snake.tail.value.col,
        };

        //Handling Valid Position

        const nextHeadCoordinate = getNextHeadCoordinate(
            currHeadCoordinate,
            direction
        );

        if (
            nextHeadCoordinate.row >= BOARD_SIZE ||
            nextHeadCoordinate.col >= BOARD_SIZE ||
            nextHeadCoordinate.row < 0 ||
            nextHeadCoordinate.col < 0 ||
            (nextHeadCoordinate.row === currTailCoordinate.row &&
                nextHeadCoordinate.col === currTailCoordinate.col)
        ) {
            gameOver();
        } else {
            if (
                nextHeadCoordinate.row > 0 &&
                nextHeadCoordinate.col > 0 &&
                snakeCell.has(board[nextHeadCoordinate.row][nextHeadCoordinate.col])
            ) {
                gameOver();
            } else {
                const newCell = {
                    row: nextHeadCoordinate.row,
                    col: nextHeadCoordinate.col,
                    cell: board[nextHeadCoordinate.row][nextHeadCoordinate.col],
                };

                //Pushing (head upto tail) to next cell
                const newHead = new LinkedListNode(newCell);
                const currHead = snake.head;
                snake.head = newHead;
                currHead.next = newHead;

                const newSnakeCells = new Set(snakeCell);

                newSnakeCells.delete(snake.tail.value.cell);
                newSnakeCells.add(board[nextHeadCoordinate.row][nextHeadCoordinate.col]);

                snake.tail = snake.tail.next;

                //Edge case when snake size is one block
                if (snake.tail === null) snake.tail = snake.head;

                //Handling Food Consumption
                if (newCell.cell === foodCell) {
                    growTheSnake(currTailCoordinate, foodCell);
                    setFoodCell(produceNewFoodPosition());
                }

                setSnakeCell(newSnakeCells);
            }
        }

    };

    const handleKeyDown = (e) => {
        if (e.key === "ArrowUp") {
            setDirection(Direction.UP);
        }
        if (e.key === "ArrowDown") {
            setDirection(Direction.DOWN);
        }
        if (e.key === "ArrowRight") {
            setDirection(Direction.RIGHT);
        }
        if (e.key === "ArrowLeft") {
            setDirection(Direction.LEFT);
        }
    };

    const [pause, setPause] = useState(false);
    const [delay, setDelay] = useState(0);
    //USEINTERVAL HOOK -->Using setInterval to move snake was creating a bug due to clash between render and componentdidupdate.
    useInterval(() => {
        if (pause) {
            moveSnake();
        }

    }, 200 - 2 * delay,[delay]);

    return (
        <div className="board">
            <button onClick={() => `${setPause(!pause)}`}>{`${!pause ? "START" : "PAUSE"}`}</button>
            <hr />

            {board.map((row, rowIndex) => {
                return (
                    <div className="row" key={rowIndex}>
                        {row.map((cellValue) => {
                            const classNameVal = getClassName(cellValue, foodCell, snakeCell, snake, board);
                            return <div className={classNameVal} key={cellValue}></div>;
                        })}
                    </div>
                );
            })}
            <hr />
            <div>Score: {score}   |   MaxScore: {maxscore}   |   Speed: {delay}</div>

        </div>
    );
};
//--------END--------//

const getClassName = (cellValue, foodCell, snakeCell, snake, board) => {
    let className = "cell";
    if (cellValue === foodCell) {
        if (foodCell % 3 === 0) {
            className = "cell food-cell-reverse";
        } else {
            className = "cell food-cell";
        }
    }
    if (snakeCell.has(cellValue)) {
        className = "cell snake-cell";
        if (snake.head.value.row < board.length && snake.head.value.col < board.length) {
            if (cellValue === board[snake.head.value.row][snake.head.value.col]) {
                className = "cell head-cell";
            }
        }
    }
    return className;
};
export default Boards;

const snakeStartPosition = (board) => {
    const startingRow = Math.round(board.length / 3);
    const startingCol = Math.round(board[0].length / 3);
    const startingCell = board[startingRow][startingCol];
    const val = {
        row: startingRow,
        col: startingCol,
        cell: startingCell,
    };
    return val;
};

const createBoard = (boardSize) => {
    const board = [];
    let cnt = 1;
    for (let i = 0; i < boardSize; i++) {
        const row = [];
        for (let j = 0; j < boardSize; j++) {
            row.push(cnt++);
        }
        board.push(row);
    }
    return board;
};

const getFoodPosition = (snakeCell) => {
    let foodPosition = Math.floor(Math.random() * BOARD_SIZE * BOARD_SIZE);
    while (snakeCell.has(foodPosition)) {
        foodPosition = Math.floor(Math.random() * BOARD_SIZE * BOARD_SIZE);
    }
    return foodPosition;
};

const getNextHeadCoordinate = (currHeadCoordinate, direction) => {
    let nextHeadCoordinate = {row: null, col: null};
    if (direction === Direction.UP) {
        nextHeadCoordinate.row = currHeadCoordinate.row - 1;
        nextHeadCoordinate.col = currHeadCoordinate.col;
    }
    if (direction === Direction.RIGHT) {
        nextHeadCoordinate.row = currHeadCoordinate.row;
        nextHeadCoordinate.col = currHeadCoordinate.col + 1;
    }
    if (direction === Direction.LEFT) {
        nextHeadCoordinate.row = currHeadCoordinate.row;
        nextHeadCoordinate.col = currHeadCoordinate.col - 1;
    }
    if (direction === Direction.DOWN) {
        nextHeadCoordinate.row = currHeadCoordinate.row + 1;
        nextHeadCoordinate.col = currHeadCoordinate.col;
    }
    return nextHeadCoordinate;
};
