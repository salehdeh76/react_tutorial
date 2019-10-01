import ReactDOM from 'react-dom';
import React from 'react';
import './index.css'

const base = [0,1,2,];

// TODO When someone wins, highlight the three squares that caused the win.

function Square(props) {
    return (
        <button className="square" onClick={props.onClick} >
            {props.value}
        </button>
    );
}

// Since the Square components no longer maintain state, the Square components receive values from the Board component and
// inform the Board component when they’re clicked. In React terms, the Square components are now controlled components.
// The Board has full control over them.
class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    generate_row(i){
        let indices = base.map((j)=>{
            return (base.length)*i+j;
        });
        let row = indices.map((j)=>{
            return this.renderSquare(j)
        });
        return(
            <div className="board-row">
                {row}
            </div>
        )
    }

    render() {
        let rows = base.map((i)=>{
            return this.generate_row(i)
        });
        return (
            <div>
                {rows}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                this_move:null,
            }],
            xIsNext: true,
            reverse:false,
        };
    }

    handleClick(i) {
        const history = this.state.history;
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                this_move: i,
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,

        });
    }

    render() {
        const history = this.state.history;
        const current = history[history.length - 1];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            const this_move = history[move].this_move;

            return (
                <li key={move}>
                    <button Class="btn btn-info" onClick={() => this.jumpTo(move)}>{history.length===(move+1)?<b>{desc}</b>:desc}</button>
                    <p>col={this_move%3}, row={Math.floor(this_move/3)}</p>
                </li>
            );
        });

        if (this.state.reverse)
            moves.reverse();


        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <br/>
                    <div>
                        <button Class="btn btn-success" onClick={()=>this.reverse()}>
                        reverse
                        </button>

                    </div>
                    <br/>
                    <br/>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }

    reverse() {
        this.setState({
            reverse: !this.state.reverse,
        })
    }
    jumpTo(move) {
        this.setState({
            // stepNumber:move,
            xIsNext: (move%2)===0,
            history: this.state.history.slice(0, move + 1)
        })

    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

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
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }

    for (let i = 0; i < 9; i++) {
        if (squares[i]==null){
            return null
        }
    }

    return "draw";
}