import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Product from './pages/product';
import Homepage from './pages/homepage';
import Pricing from './pages/pricing';
import Notfound from './pages/notfound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="product" element={<Product />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
