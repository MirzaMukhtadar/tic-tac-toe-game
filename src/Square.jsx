import React, { useEffect, useState } from "react";
import "./style.css";
import { Link } from "react-router-dom";

function Square({ value, onSquareClick }) {
  let squareClass = "square";
  if (value === "X") {
    squareClass += " x-style";
  } else if (value === "O") {
    squareClass += " o-style";
  }
  return (
    <>
      <button className={squareClass} onClick={onSquareClick}>
        {value}
      </button>
    </>
  );
}

function Board({ squares, xIsNext, onPlay }) {
  const [showWinner, setShowWinner] = useState(false);

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;

  if (winner) {
    // status = "Winner: " + winner;
  } else {
    status = "Next Player: " + (xIsNext ? "X" : "O");
  }

  useEffect(() => {
    if (winner) {
      setShowWinner(true);
      const timer = setTimeout(() => {
        setShowWinner(false);
        const confettiWrapper = document.getElementById("confetti-wrapper");
        if (confettiWrapper) {
          confettiWrapper.innerHTML = ""; // Remove all confetti pieces from the DOM
        }
      }, 8000); // 3 seconds, adjust the time as needed
      return () => clearTimeout(timer);
    }
  }, [winner]);

  const rain = () => {
    const colors = [
      "#0CD977",
      "#FF1C1C",
      "#FF93DE",
      "#5767ED",
      "#FFC61C",
      "#8497B0",
    ];

    const createConfettiPiece = () => {
      const randomRotation = Math.floor(Math.random() * 180);
      const randomScale = Math.random();
      const randomWidth = Math.floor(
        Math.random() *
          Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
      );
      const randomHeight = Math.floor(
        Math.random() *
          Math.max(
            document.documentElement.clientHeight,
            window.innerHeight || 500
          )
      );
      const randomAnimationDelay = Math.random() * 5;
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.top = randomHeight + "px";
      confetti.style.right = randomWidth + "px";
      confetti.style.backgroundColor = randomColor;
      confetti.style.opacity = randomScale;
      confetti.style.transform =
        "skew(15deg) rotate(" + randomRotation + "deg)";
      confetti.style.animationDelay = randomAnimationDelay + "s";
      document.getElementById("confetti-wrapper").appendChild(confetti);
    };

    for (let i = 0; i < 100; i++) {
      createConfettiPiece();
    }
  };

  return (
    <>
      <h3 className="text-center">TIC-TAC-TOE</h3>
      <div className="center_boxes">
        <div className="row_sqaure">
          <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
          <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
          <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
        </div>
        <div className="row_sqaure">
          <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
          <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
          <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
        </div>
        <div className="row_sqaure">
          <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
          <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
          <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
        </div>
        <div className={`status ${winner ? "show" : ""}`}>{status}</div>
        {showWinner && (
          <>
            <div class="modal">
              <span class="emoji round">🏆</span>
              <h1> Winner: {winner}</h1>
              <button className="modal-btn" onClick={rain}>
                Celebrate
              </button>
            </div>
          </>
        )}
        {/* <div className={`winner-message ${showWinner ? "show" : ""}`}></div> */}
        <div id="confetti-wrapper"></div>
      </div>
    </>
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default function Game() {
  //   const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);

  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  const handlePlay = (nextSquares) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  };
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }

    return (
      <div key={move}>
        <button onClick={() => jumpTo(move)} className="game_info_btn">
          {description}
        </button>
      </div>
    );
  });

  return (
    <div>
      <div className="game_board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game_info">
        <div>{moves}</div>
      </div>
    </div>
  );
}
