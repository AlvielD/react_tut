import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

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

  renderSquare(i, key) {
    return (
      <Square
        key={key}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    )
  }
  
  render() {

    // Generate the array of squares to be rendered
    let squares = []
    for (let i=0; i<3; i++) {
      let row = []
      for (let j=0; j<3; j++) {
        row.push(this.renderSquare(i*3+j, `square-${i}-${j}`));
      }
      squares.push(<div key={`row-${i}`} className='board-row'>{row}</div>);
    }

    return (
      <div>
        {squares}
      </div>
    );
  }
}
  
class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      history: [{
        n_move: 0,
        squares: Array(9).fill(null),
        lastMove: null,
        boldDesc: false,
      }],
      stepNumber: 0,
      xIsNext: true,
      listOrdering: "ascending",
    };
  }

  /**
   * Handles the click event raised when clicking one of the squares of
   * the board
   * @param {int} i - index of the clicked square
   */
  handleClick(i) {
    // Create a copy of the array instead of getting the original one
    // this is done by the slice() method
    // this is important because gives immutability to the component
    const history = this.state.history.slice(0, this.state.stepNumber+1);
    const current = history[history.length-1];
    const squares = current.squares.slice();

    // Update the state if there is no winner yet and the square is not filled
    if (!calculateWinner(squares) && !squares[i]) {
      squares[i] = this.state.xIsNext ? 'X': 'O';
      this.setState(prevState => ({
        history: history.concat([{
          n_move: history.length,
          squares: squares,
          lastMove: i,
          boldDesc: false,
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      }));
    }
  }

  /**
   * The method set the state to a previous one. Recovers the board
   * with the step associated to it and guess the player by determining
   * if the step is even or odd.
   * @param {int} step - the number representing the move we want to recover
   */
  jumpTo(step) {

    // Create a copy of the history just making the property "boldDesc"
    // where we jumped to true.
    const history = this.state.history

    // Set all the descriptions to not bold
    history.map(step => {
      step.boldDesc = false
    });

    // Bold only the selected one
    history[step].boldDesc = true;

    // Update state to the one we are jumping to
    this.setState({
      history: history,
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });

    console.log(this.state)
  }

  render() {
    let history = this.state.history;                 // History of movements
    const current = history[this.state.stepNumber];   // Current state of the game
    const winner = calculateWinner(current.squares);  // Calculate the winner on the current state
    
    // Reverse history if needed
    if (this.state.listOrdering == "descending") {
      history = [...history].reverse();
    }

    // Get list of movements
    const moves = history.map(step => {
      let desc = step.n_move ?
        `Go to move #${step.n_move} | (${Math.floor(step.lastMove / 3) + 1}, ${step.lastMove % 3 + 1})`:
        `Go to game start`;
      // Add key to the list item so we are able to recover them
      return (
        <li key={step.n_move}>
          <button 
            onClick={() => this.jumpTo(step.n_move)}
            style={{ fontWeight: step.boldDesc ? 'bold':'normal'}}
          >
            {desc}
          </button>
        </li>
      );
    });
    
    let status;
    console.log(history);

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
          <input 
            type='button'
            onClick={() => {
              // Change the value of the button depending on the current
              // value.
              let new_val = 'ascending';
              if (this.state.listOrdering === "ascending") {
                new_val = "descending"; 
              }

              this.setState({
                ...this.state,
                listOrdering: new_val
              });
            }}
            value={`Switch to ${this.state.listOrdering} ordering`}
          />
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
  