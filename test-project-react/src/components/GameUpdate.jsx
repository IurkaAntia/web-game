import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateGame, deleteGame } from "../../store/slices/gamesSlice";
import { fetchCategory } from "../../store/slices/categorySlice";

function GameUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { games, loading, error } = useSelector((state) => state.games);
  const { category } = useSelector((state) => state.category);
  const [currentImage, setCurrentImage] = useState("");

  const game = games.find((game) => game.id === parseInt(id));

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    rules: "",
    image: null,
    is_active: true,
    category_id: "",
  });

  useEffect(() => {
    dispatch(fetchCategory());
  }, [dispatch]);

  useEffect(() => {
    if (game) {
      setFormData({
        name: game.name || "",
        description: game.description || "",
        rules: JSON.stringify(game.rules || {}),
        image: null, // Reset image field on load
        is_active: game.is_active ?? true,
        category_id: game.category_id || "",
      });

      setCurrentImage(
        game.image ? `http://localhost:8000/storage/${game.image}` : ""
      );
    }
  }, [game]);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this game?")) {
      dispatch(deleteGame(id));
      navigate("/dashboard");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, [name]: reader.result });
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      name: formData.name,
      category_id: formData.category_id,
      description: formData.description,
      rules:
        formData.rules && typeof formData.rules === "object"
          ? JSON.stringify(formData.rules)
          : formData.rules,
      image: formData.image,
      is_active: formData.is_active,
    };

    dispatch(updateGame(id, data));
    navigate("/dashboard");
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">Error: {error}</div>;
  }

  if (!game) {
    return <div className="text-center py-10">Game not found</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Update Game</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg space-y-6"
      >
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Game Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter game name"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter game description"
            rows="4"
            required
          />
        </div>

        {/* Rules */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rules (JSON format)
          </label>
          <textarea
            name="rules"
            value={formData.rules}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
            placeholder='{"key": "value"}'
            rows="4"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Image
          </label>
          {currentImage && (
            <img
              src={currentImage}
              alt="Current Game"
              className="mb-4 w-32 h-32 object-cover"
            />
          )}
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload New Image (Optional)
          </label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="w-full text-gray-700"
          />
        </div>

        {/* Active Status */}
        <div>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active} // Bind the checkbox state to formData.is_active
              onChange={handleChange} // Handle changes in state when clicked
              className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Active</span>
          </label>
        </div>
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>

          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="" disabled>
              Select a category
            </option>
            {category.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded"
          >
            Update Game
          </button>
        </div>
        <div className="container mx-auto p-6">
          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2 rounded mt-4"
          >
            Delete Game
          </button>
        </div>
      </form>
    </div>
  );
}

export default GameUpdate;
