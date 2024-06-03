import { AuthContextProvider } from "./context/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Random from "./gamble/Random";
import Profile from "./pages/Profile";
import Ranking from "./pages/Ranking";
import SlotMachine from "./gamble/SlotMachine";
import Shop from "./pages/Shop";

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/gamble/random" element={<Random />} />
          <Route path="/gamble/slot" element={<SlotMachine />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/shop" element={<Shop />}></Route>
        </Routes>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
