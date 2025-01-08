import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Login from "./auth/Login.jsx";
import Register from "./auth/Register.jsx";
import GameShow from "./components/GameShow.jsx";
import store from "../store/store.js"; // Import the Redux store
import GameCreate from "./components/GameCreate.jsx";
import Header from "./components/Header.jsx";
import GameUpdate from "./components/GameUpdate.jsx";
import AdminRoute from "./components/AdminRoute.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/dashboard" element={<App />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="/games/:gameId" element={<GameShow />} />
          <Route
            path="/update/:id"
            element={
              <AdminRoute>
                <GameUpdate />
              </AdminRoute>
            }
          />
          <Route
            path="/create"
            element={
              <AdminRoute>
                <GameCreate />
              </AdminRoute>
            }
          />

          <Route path="*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
