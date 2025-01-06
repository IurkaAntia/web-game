import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchGameById, selectGames } from "../../store/slices/gamesSlice";
import GuessGame from "./Games/GuessGame";
import TicTacToe from "./Games/TickTackToe";

function GameShow() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { game, loading, error } = useSelector(selectGames);

  useEffect(() => {
    if (gameId) {
      dispatch(fetchGameById(gameId));
    }
  }, [gameId, dispatch]);

  const renderGame = () => {
    if (loading)
      return <p className="text-gray-500">Loading game details...</p>;
    if (!game) return <p className="text-red-500">Game not found.</p>;

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
}

export default GameShow;
