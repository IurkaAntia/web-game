import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/authSlice"; // Import logout action

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Access authentication state from Redux store
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout()); // Dispatch the logout action
    navigate("/dashboard"); // Navigate to the login page
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-semibold">My Application</h1>
        <nav>
          <ul className="flex space-x-6">
            {!isAuthenticated ? (
              <>
                <li>
                  <Link to="/dashboard" className="hover:text-blue-300">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-blue-300">
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
