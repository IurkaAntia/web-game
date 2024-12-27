import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import GuessGame from "./Games/GuessGame";
import TicTacToe from "./Games/TickTackToe";

const GameShow = () => {
  const { gameId } = useParams(); // Get game ID from the route params
  const [game, setGame] = useState(null);
//   const [userGuess, setUserGuess] = useState("");
//   const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGame = async () => {
      const token = localStorage.getItem("auth_token");
      try {
        const response = await axios.get(
          `http://localhost:8000/api/games/${gameId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
         // Log the game data to check the response
        setGame(response.data);
      
         
      } catch (err) {
        setError("Failed to fetch game details.");
        console.error(err);
      }
    };

    fetchGame();
  }, [gameId]);


    const renderGame = () => {
      if (!game)
        return <p className="text-gray-500">Loading game details...</p>;
      switch (game.game.name) {
        case "Guess the Number":
          return <GuessGame game={game} />;
        case "Tic Tac Toe":
          return <TicTacToe game={game} />;
        default:
          return <p className="text-red-500">Unknown game type.</p>;
      }
    };

    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white py-6">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">
              {game ? game.name : "Loading..."}
            </h1>
            {game && <p className="text-sm">{game.description}</p>}
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="bg-white shadow-md rounded-lg p-6">
            {renderGame()}
            <button
              onClick={() => navigate(-1)}
              className="mt-4 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition"
            >
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    );

};

export default GameShow;
