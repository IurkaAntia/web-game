import { useState, useEffect } from "react";
import axios from "axios";

function TicTacToe({ game }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [score, setScore] = useState(game.points || 0);
  const [level, setLevel] = useState(game.metadata?.level || 1); // Start from level 1
  const [moves, setMoves] = useState(0);
  const [difficulty, setDifficulty] = useState(
    game.metadata?.difficulty || "easy"
  ); // Easy by default
  const [gameOverMessage, setGameOverMessage] = useState("");

  const rules = JSON.parse(game.game.rules);

  const checkWinner = (board) => {
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

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    return null;
  };

  const computerMove = (currentBoard) => {
    const emptyIndices = currentBoard
      .map((cell, index) => (cell === null ? index : null))
      .filter((index) => index !== null);

    if (emptyIndices.length === 0) return currentBoard;

    if (difficulty === "easy") {
      const randomIndex =
        emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      currentBoard[randomIndex] = "O";
    } else if (difficulty === "medium") {
      if (emptyIndices.includes(4)) {
        currentBoard[4] = "O";
      } else {
        const randomIndex =
          emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        currentBoard[randomIndex] = "O";
      }
    } else if (difficulty === "hard") {
      const randomIndex =
        emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      currentBoard[randomIndex] = "O";
    }

    return currentBoard;
  };

  const handleClick = async (index) => {
    if (board[index] || winner) return;

    const newBoard = board.slice();
    newBoard[index] = "X";

    setMoves((prev) => prev + 1); // Increment move count

    const playerWinner = checkWinner(newBoard);

    if (!playerWinner) {
      const computerBoard = computerMove(newBoard);
      const computerWinner = checkWinner(computerBoard);
      setBoard(computerBoard);
      setWinner(computerWinner);

      if (computerWinner) {
        setGameOverMessage("You lost the game!");

        try {
          const token = localStorage.getItem("auth_token");
          await axios.post(
            `http://localhost:8000/api/games/${game.game.id}/play`,
            {
              user_points: 0,
              points: score,
              metadata: {
                level,
                moves,
                difficulty,
                is_winner: false,
              },
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (err) {
          console.error("Failed to save game state." + err);
        }
      }
    } else {
      setBoard(newBoard);
      setWinner(playerWinner);

      if (playerWinner === "X") {
        const increment = rules.points_for_exact;
        const updatedScore = score + increment;
        setScore(updatedScore);
        setGameOverMessage("You win! Congratulations!");

        try {
          const token = localStorage.getItem("auth_token");
          await axios.post(
            `http://localhost:8000/api/games/${game.game.id}/play`,
            {
              user_points: increment,
              points: updatedScore,
              metadata: {
                level,
                moves,
                difficulty,
                is_winner: true,
              },
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // Progress to the next level
          setLevel((prev) => prev + 1);
          setDifficulty(level >= 3 ? "hard" : level >= 2 ? "medium" : "easy");
          resetGame();
        } catch (err) {
          console.error("Failed to save game state." + err);
        }
      }
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setMoves(0);
    setGameOverMessage("");
  };

  // Reset score when the component unmounts (or when navigating away)
  useEffect(() => {
    // Optionally, you could reset score or level if game is reloaded
    setScore(0); // Reset score on load (if that's desired)
  }, [game.game.id]); // Trigger reset when the game ID changes (or whenever game updates)

  return (
    <div className="flex flex-col items-center py-6">
      <h2 className="text-2xl font-bold mb-4">{game.game.name}</h2>
      <p className="text-lg mb-2">Level: {level}</p>
      <p className="text-lg mb-2">Difficulty: {difficulty}</p>
      <div
        className="grid grid-cols-3 gap-2"
        style={{ width: "300px", height: "300px" }}
      >
        {board.map((cell, index) => (
          <div
            key={index}
            onClick={() => handleClick(index)}
            className="w-24 h-24 flex items-center justify-center border bg-white shadow-md text-4xl font-bold cursor-pointer"
            style={{ backgroundColor: cell ? "#f1f5f9" : "#ffffff" }}
          >
            {cell}
          </div>
        ))}
      </div>
      {gameOverMessage && (
        <p className="mt-4 text-lg font-semibold text-green-600">
          {gameOverMessage}
        </p>
      )}
      <p className="mt-4 text-lg font-semibold">Total Score: {score}</p>
      <p className="mt-2 text-sm text-gray-600">Moves: {moves}</p>
      <button
        onClick={resetGame}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Reset Game
      </button>
    </div>
  );
}

export default TicTacToe;
