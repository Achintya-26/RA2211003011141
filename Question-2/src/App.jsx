import { BrowserRouter as Router, Route, Routes, NavLink } from "react-router-dom";
import TopUsers from "./Pages/TopUsers";
import Feed from "./Pages/Feed";
import TrendingPosts from "./Pages/TrendingPosts";


const App = () => {
  return (
    <Router>
      <div className="p-4">
      <nav className="mb-6 bg-white shadow-lg p-4 rounded-lg flex justify-around text-lg font-semibold">
          <NavLink className="text-blue-600 hover:text-blue-800" to="/">Top Users</NavLink>
          <NavLink className="text-red-600 hover:text-red-800" to="/trending">Trending Posts</NavLink>
          <NavLink className="text-green-600 hover:text-green-800" to="/feed">Feed</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<TopUsers />} />
          <Route path="/trending" element={<TrendingPosts />} />
          <Route path="/feed" element={<Feed />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
