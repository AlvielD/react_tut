import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// The classes need to extend the React.component class
/*
class Square extends React.Component {
  render() {
    return (
      <button 
        className="square"
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    );
  }
}
*/

// This is called 'function component': easier way of writing classes
// that only has a render method.
function Square(props) {
  return (
    <button className='square' onClick={props.onClick}>
      {props.value}
    </button>
  );
}
  
class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    )
  }
  
  render() {
 
    // Return the board to be rendered, plus the status of the match
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
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
      }],
      xIsNext: true,
    };
  }

  // Define the handle for the click event
  handleClick(i) {
    // Create a copy of the array instead of getting the original one
    // this is done by the slice() method
    // this is important because gives immutability to the component
    const history = this.state.history;
    const current = history[history.length-1];
    const squares = current.squares.slice();

    // If the square is already filled or the match is finished, don't
    // do anything
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    // Otherwise, update square and state of the component
    squares[i] = this.state.xIsNext ? 'X': 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[history.length-1];        // Current state of the game
    const winner = calculateWinner(current.squares);  // Calculate the winner on the current state
    
    const moves = history.map((step, move) => {
      const desc = move ?
        `Go to move #${move}`:
        `Go to game start`;
      return (
        <li>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    
    let status;

    // If there is a winner, update status to the winner, otherwise
    // declare who is the next player to play
    if (winner) {
      status = `Winner: ${winner}`;
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X':'O'}`;
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
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

/**
 * Given an array of 9 squares, check for a winner and return 'X', 'O'
 * or null depending on the winner.
 * @param {Array} squares - the array of 9 squares representing the board of the game 
 * @returns - the winner of the match if there is one. Null otherwise.
 */
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

  return null;
}
  
// ========================================
  
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
  