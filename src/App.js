import { useState } from 'react';
function Square({ value, onSquareClick }) {
    return (
        <button className='square' onClick={onSquareClick}>
            {value}
        </button>
    );
}

function Board({ xIsNext, squares, onPlay }) {
    function handleClick(i) {
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = 'X';
        } else {
            nextSquares[i] = 'O';
        }
        onPlay(nextSquares);
    }

    const winner = calculateWinner(squares);
    const draw = drawGame(squares);
    let status;
    if (winner) {
        status = `Winner: ${winner}`;
    } else if (draw === 0) {
        status = 'Draw game';
    } else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }

    function sq(index) {
        return (
            <Square
                value={squares[index]}
                onSquareClick={() => handleClick(index)}
            />
        );
    }

    return (
        <>
            <div className='status'>{status}</div>
            <div className='board-row'>
                {sq(0)}
                {sq(1)}
                {sq(2)}
            </div>
            <div className='board-row'>
                {sq(3)}
                {sq(4)}
                {sq(5)}
            </div>
            <div className='board-row'>
                {sq(6)}
                {sq(7)}
                {sq(8)}
            </div>
        </>
    );
}

function Moves({ history, setCurrentMove, currentMove }) {
    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }
    const moves = history.map((squares, move) => {
        let description;
        if (move > 0) {
            description = `Go to move #${move}`;
        } else {
            description = 'Go to game start';
        }
        return description;
    });
    return (
        <ol>
            {moves.map((value, key) => (
                <li key={key}>
                    <button onClick={(event) => jumpTo(key)}>{value}</button>
                </li>
            ))}
        </ol>
    );
}

export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    // function jumpTo(nextMove) {
    //     setCurrentMove(nextMove);
    // }

    // const moves = history.map((squares, move) => {
    //     let description;
    //     if (move > 0) {
    //         description = `Go to move #${move}`;
    //     } else {
    //         description = 'Go to game start';
    //     }
    //     return (
    //         <li key={move}>
    //             <button onClick={() => jumpTo(move)}>{description}</button>
    //         </li>
    //     );
    // });
    return (
        <div className='game'>
            <div className='game-board'>
                <Board
                    xIsNext={xIsNext}
                    squares={currentSquares}
                    onPlay={handlePlay}
                />
            </div>
            <div className='game-info'>
                {/* <ol>{moves}</ol> */}
                <Moves
                    history={history}
                    setCurrentMove={setCurrentMove}
                    currentMove={currentMove}
                />
            </div>
        </div>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]
        ) {
            return squares[a];
        }
    }
    return null;
}

function drawGame(squares) {
    let draw = 0;
    for (let i = 0; i < squares.length; i++) {
        if (!squares[i]) {
            draw++;
        }
    }
    return draw;
}
