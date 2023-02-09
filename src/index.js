import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
function Square(props) {
    return (
        <button className='square' onClick={props.onclick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onclick={() => {
                    this.props.onClick(i);
                }}
            />
        );
    }

    render() {
        //There is probably a better way to do this
        let boardGame = [];
        let index = 0;
        for (let i = 0; i < 3; i++) {
            boardGame.push(
                <div key={`row-${i}`} className='board-row'>
                    {this.renderSquare(index++)}
                    {this.renderSquare(index++)}
                    {this.renderSquare(index++)}
                </div>
            );
        }
        return <div>{boardGame}</div>;
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                },
            ],
            stepNumber: 0,
            xIsNext: true,
        };
    }
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([
                {
                    squares: squares,
                },
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: step % 2 === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ? `Go to move #${move}` : 'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else if (!winner && this.state.stepNumber === 9) {
            status = 'Draw game';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className='game'>
                <div className='game-board'>
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className='game-info'>
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
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
            squares[b] === squares[c] &&
            squares[c]
        ) {
            return squares[a];
        }
    }
    return null;
}

function locateMove(square) {
    const cells = {
        0: {
            col: 1,
            row: 1,
        },
        1: {
            col: 1,
            row: 2,
        },
        2: {
            col: 1,
            row: 3,
        },
        3: {
            col: 2,
            row: 1,
        },
        4: {
            col: 2,
            row: 2,
        },
        5: {
            col: 2,
            row: 3,
        },
        6: {
            col: 3,
            row: 1,
        },
        7: {
            col: 3,
            row: 2,
        },
        8: {
            col: 3,
            row: 3,
        },
    };
    return cells[square];
}
// ========================================

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Game />);
