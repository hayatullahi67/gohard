import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/CartDrawer';
import WhatsAppButton from './components/WhatsAppButton';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const LayoutWrapper = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className="flex flex-col min-h-screen">
      {!isDashboard && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!isDashboard && <Footer />}
      {!isDashboard && <WhatsAppButton />}
      <CartDrawer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <CartProvider>
      <HashRouter>
        <ScrollToTop />
        <LayoutWrapper>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/about" element={<About />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </LayoutWrapper>
      </HashRouter>
    </CartProvider>
  );
};

export default App;