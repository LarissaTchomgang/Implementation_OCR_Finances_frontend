import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ReviewPage from "./pages/ReviewPage";
import HistoriquePage from "./pages/HistoriquePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/historique" element={<HistoriquePage />} />
      </Routes>
    </Router>
  );
}

export default App;
