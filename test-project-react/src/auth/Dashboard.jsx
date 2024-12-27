import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [games, setGames] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("auth_token");
      try {
        const response = await axios.get("http://localhost:8000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        setError("Failed to fetch user data.");
        console.error(error);
      }
    };

    const fetchGames = async () => {
      const token = localStorage.getItem("auth_token");
      try {
        const response = await axios.get("http://localhost:8000/api/games", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setGames(response.data);
      } catch (error) {
        setError("Failed to fetch games.");
        console.error(error);
      }
    };

    fetchUserData();
    fetchGames();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          {user && (
            <p className="mt-2">
              Welcome, <span className="font-semibold">{user.name}</span>! You
              have <span className="font-semibold">{user.points}</span> points.
            </p>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <h2 className="text-2xl font-bold mb-6">Available Games</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition"
              onClick={() => navigate(`/games/${game.id}`)}
            >
              <h3 className="text-xl font-semibold mb-2">{game.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{game.description}</p>
              <p className="text-blue-600 font-medium">Play now →</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
