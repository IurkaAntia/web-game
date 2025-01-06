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

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      {" "}
      {/* Wrap your app with the Redux Provider */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="/games/:gameId" element={<GameShow />} />
          <Route path="/create" element={<GameCreate />} />

          <Route path="*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
