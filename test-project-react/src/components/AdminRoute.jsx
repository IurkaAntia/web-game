import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const user = useSelector((state) => state.auth.user);

  if (!user || user.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export default AdminRoute;
