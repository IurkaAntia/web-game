import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUser } from "../../store/slices/authSlice";
import { fetchGames, selectGames } from "../../store/slices/gamesSlice";
import { fetchCategory } from "../../store/slices/categorySlice";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("");

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

  const {
    category,
    loading: categoryLoading,
    error: categoryError,
  } = useSelector((state) => state.category);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUser());
      dispatch(fetchCategory());
      dispatch(fetchGames());
    }
  }, [dispatch, isAuthenticated]);

  const filteredGames = selectedCategory
    ? games.filter((game) => game.category_id.toString() === selectedCategory)
    : games;

  const errorMessage = userError || gamesError || categoryError;

  if (gamesLoading || categoryLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg font-medium text-gray-700">Loading...</p>
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

        {/* Category Filter Dropdown */}
        <div className="mb-6">
          <label htmlFor="category" className="font-semibold text-lg mr-2">
            Filter by Category:
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white text-black py-2 px-4 rounded"
          >
            <option value="">All Categories</option>
            {category && category.length > 0 ? (
              category.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))
            ) : (
              <option value="">No categories available</option>
            )}
          </select>
        </div>

        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredGames.map((game) => {
              const imageUrl = game.image
                ? `http://localhost:8000/storage/${game.image}`
                : null;

              return (
                <div
                  key={game.id}
                  className="bg-white shadow-md rounded-lg p-4"
                >
                  {/* Display game image if available */}
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={game.name}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  )}
                  <h3 className="text-xl font-semibold mb-2">{game.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {game.description}
                  </p>
                  <div className="flex flex-row justify-between">
                    <p
                      className="text-blue-600 font-medium cursor-pointer"
                      onClick={() => navigate(`/games/${game.id}`)}
                    >
                      Play now →
                    </p>
                    {user.role === "admin" && (
                      <p
                        className="text-blue-600 font-medium cursor-pointer"
                        onClick={() => navigate(`/update/${game.id}`)}
                      >
                        Update
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
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
}

export default Dashboard;
