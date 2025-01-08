import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createGame, selectGames } from "../../store/slices/gamesSlice";

function GameCreate() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(selectGames);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    rules: "",
    image: null,
    is_active: true,
    category_id: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
      console.log(data);
    });

    dispatch(createGame(data));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create Game</h1>
      {loading && <p className="text-blue-500">Creating game...</p>}
      {error && <p className="text-red-500">{error}</p>}
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
            Upload Image
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
              checked={formData.is_active}
              onChange={handleChange}
              className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Active</span>
          </label>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category ID
          </label>
          <input
            type="number"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter category ID"
            required
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded"
            disabled={loading}
          >
            Create Game
          </button>
        </div>
      </form>
    </div>
  );
}

export default GameCreate;
