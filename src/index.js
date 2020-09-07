import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// TrieNode represents each letter in a word
class TrieNode {
  constructor(letter) {
    this.letter = letter;
    this.parent = null;
    this.children = {};
    this.isWord = false;
  }

  getWord() {
    var output = [];
    var node = this;
    
    while (node !== null) {
      output.unshift(node.letter);
      node = node.parent;
    }
    
    return output.join('');
  }
}

function Trie() {
  this.root = new TrieNode(null);
}

Trie.prototype.insert = function(word) {
  var currNode = this.root;

  for(var i = 0; i < word.length; i++) {
    // if current letter is not there
    if(!currNode.children[word[i]]) {
      currNode.children[word[i]] = new TrieNode(word[i]);

      currNode.children[word[i]].parent = currNode;
    }

    currNode = currNode.children[word[i]];

    if(i === word.length - 1) {
      currNode.isWord = true;
    }
  }
}

function findAllChildrenWords(node, arr) {
  if(node.isWord) {
    arr.unshift(node.getWord());
  }

  for(var child in node.children) {
    findAllChildrenWords(node.children[child], arr);
  }
}

Trie.prototype.findAllWithPrefix = function(prefix) {
  var currNode = this.root;
  var output = [];

  for(var i = 0; i < prefix.length; i++) {
    if(currNode.children[prefix[i]]) {
      currNode = currNode.children[prefix[i]];
    } else {
      return output;
    }
  }

  findAllChildrenWords(currNode,output);

  return output;
}

var trie = new Trie();

// insert few values
trie.insert("hello");
trie.insert("helium");

console.log(trie.findAllWithPrefix("he"));

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
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
    );
  }

  render() {
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
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true
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
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move :
      'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move) }>{desc}</button>
        </li>
      );

    });

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
          <ol>{moves}</ol>
        </div>
      </div>
    );
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
  return null;
}
