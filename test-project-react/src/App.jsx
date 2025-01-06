import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "./components/Header";
import Dashboard from "./auth/Dashboard";
import Login from "./auth/Login";
import { fetchUser, logout } from "../store/slices/authSlice";

const App = () => {
  const dispatch = useDispatch();
  const { user, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      dispatch(logout());
      return;
    }

    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <div>
      <Header user={user} />
      {error && <p>{error}</p>}
      {isAuthenticated ? <Dashboard /> : <Login />}
    </div>
  );
};

export default App;
