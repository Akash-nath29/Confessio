import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar'
import Hero from './components/Hero';
import CreatePost from "./components/CreatePost";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Hero />} />
        <Route path="/create" element={<CreatePost />} />
        {/* <Route path="/contact" element={<EditTask />} />
        <Route path="/blogs" element={<DeleteTask />} /> */}
      </Routes>
      {/* <Footer /> */}
    </Router>
  )
}

export default App
