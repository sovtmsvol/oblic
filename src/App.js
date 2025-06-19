import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AssetTracker from "./components/AssetTracker";
import AssetPassport from "./components/AssetPassport";
import './styles.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AssetTracker />} />
        <Route path="/passport/:id" element={<AssetPassport />} />
      </Routes>
    </Router>
  );
}

export default App;
