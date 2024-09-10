import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar'
import Hero from './components/Hero';
import CreatePost from "./components/CreatePost";
import Help from "./components/Help";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/help" element={<Help />} />
      </Routes>
      {/* <Footer /> */}
    </Router>
  )
}

export default App
