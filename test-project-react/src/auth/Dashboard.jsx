import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUser } from "../../store/slices/authSlice";
import { fetchGames, selectGames } from "../../store/slices/gamesSlice";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    user,
    error: userError,
    isAuthenticated,
  } = useSelector((state) => state.auth);

  const {
    games,
    error: gamesError,
    loading: gamesLoading,
  } = useSelector(selectGames);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUser());
      dispatch(fetchGames());
    }
  }, [dispatch, isAuthenticated]);

  const errorMessage = userError || gamesError;

  if (gamesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg font-medium text-gray-700">Loading games...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{errorMessage}</p>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-6">Available Games</h2>
        {games.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {games.map((game) => (
              <div key={game.id} className="bg-white shadow-md rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-2">{game.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{game.description}</p>
                <div className="flex flex-row justify-between ">
                  <p
                    className="text-blue-600 font-medium cursor-pointer"
                    onClick={() => navigate(`/games/${game.id}`)}
                  >
                    Play now →
                  </p>
                  {user.role == "admin" && (
                    <p className="text-blue-600 font-medium cursor-pointer">
                      update
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-700">No games available at the moment.</p>
        )}
      </main>

      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Game Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
