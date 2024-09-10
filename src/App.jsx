import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CreatePost from "./components/CreatePost";
import Help from "./components/Help";

const App = () => {
  return (
    <div>
      <Navbar />
      <Router>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/help" element={<Help />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
