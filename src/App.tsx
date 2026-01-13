import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAppStore } from './stores/useAppStore';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { SyncScreen } from './components/SyncScreen';
import { HomePage } from './pages/HomePage';
import { CartPage } from './pages/CartPage';
import { OrdersPage } from './pages/OrdersPage';
import { ScanPage } from './pages/ScanPage';
import './App.css';

function App() {
  const initialize = useAppStore(state => state.initialize);
  const isLoading = useAppStore(state => state.isLoading);
  const showSyncScreen = useAppStore(state => state.showSyncScreen);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading && showSyncScreen) {
    return <SyncScreen />;
  }

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/scan" element={<ScanPage />} />
          </Routes>
        </main>
        <Toast />
      </div>
    </BrowserRouter>
  );
}

export default App;
