import { useState } from "react";
import axios from "axios";

function GuessGame({ game }) {
  const [userGuess, setUserGuess] = useState("");
  const [message, setMessage] = useState("");
  const [pointsEarned, setPointsEarned] = useState(0);
  const [error, setError] = useState("");

  const rules = JSON.parse(game.game.rules);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const randomNumber =
      Math.floor(Math.random() * (rules.max_number - rules.min_number + 1)) +
      rules.min_number;

    let points = 0;
    if (userGuess == randomNumber) {
      points = rules.points_for_exact;
    } else if (Math.abs(userGuess - randomNumber) <= 10) {
      points = rules.points_for_close;
    }

    setPointsEarned(points);

    try {
      const token = localStorage.getItem("auth_token");
      await axios.post(
        `http://localhost:8000/api/games/${game.game.id}/play`,
        {
          points,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        `Your guess: ${userGuess}. Random number: ${randomNumber}. Points earned: ${points}.`
      );
    } catch (err) {
      setError("Failed to save game state.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-4">
        {game.game.name}
      </h2>
      <p className="text-lg text-center mb-6">
        Rules: Guess a number between {rules.min_number} and {rules.max_number}.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          value={userGuess}
          onChange={(e) => setUserGuess(e.target.value)}
          placeholder="Enter your guess"
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
      {message && (
        <p className="mt-4 text-center text-lg font-semibold text-green-600">
          {message}
        </p>
      )}
      {error && (
        <p className="mt-4 text-center text-lg font-semibold text-red-600">
          {error}
        </p>
      )}
      {pointsEarned > 0 && (
        <p className="mt-4 text-center text-lg font-semibold text-green-600">
          You earned {pointsEarned} points!
        </p>
      )}
    </div>
  );
};

export default GuessGame;
