import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout, fetchUser } from "../../store/slices/authSlice";
import { useEffect } from "react";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    if (!user) {
      dispatch(fetchUser()); 
    }
  }, [dispatch, user]);

  return (
    <header className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            <Link to="/dashboard">Dashboard</Link>
          </h1>
          {user && (
            <p className="mt-2">
              Welcome, <span className="font-semibold">{user.name}</span>! You
              have{" "}
              <span className="font-semibold">{user.points || 0} points.</span>
            </p>
          )}
        </div>
        <nav>
          <ul className="flex space-x-6">
            {!isAuthenticated ? (
              <>
                <li>
                  <Link to="/login" className="hover:text-blue-300">
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
              window.location.pathname === "/dashboard" && ( // Correct condition here
                <li className="flex items-center space-x-4">
                  {user?.role === "admin" && (
                    <button
                      onClick={() => navigate("/create")}
                      className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                    >
                      Create
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                  >
                    Logout
                  </button>
                </li>
              )
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
