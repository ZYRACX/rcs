import { Routes, Route } from "react-router-dom";

// pages
import Home from "./pages/Home";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import GameHome from "./pages/game/GameRouter";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/login" element={<Login />} />
      {/* Wildcard (*) is important for nested routes */}
      <Route path="/game/*" element={<GameHome />} />
    </Routes>
  );
}

export default App;
