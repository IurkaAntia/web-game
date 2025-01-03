import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "./components/Header";
import Dashboard from "./auth/Dashboard";
import Login from "./auth/Login";
import { fetchUser, logout } from "../store/slices/authSlice";

const App = () => {
  const dispatch = useDispatch();
  const { error, isAuthenticated } = useSelector((state) => state.auth);

  // Fetch user data when the app loads
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      dispatch(logout()); // If no token, logout user
      return;
    }

    // Dispatch fetchUser to load the user data
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <div>
      <Header />
      {error && <p>{error}</p>}
      {isAuthenticated ? <Dashboard /> : <Login />}
    </div>
  );
};

export default App;
