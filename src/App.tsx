import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import DestinationDetail from '@/pages/DestinationDetail';
import Quiz from '@/pages/Quiz';
import Wishlist from '@/pages/Wishlist';
import FootprintMap from '@/pages/FootprintMap';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/destination/:id" element={<DestinationDetail />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/map" element={<FootprintMap />} />
      </Routes>
    </Router>
  );
}
