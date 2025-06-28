import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Toaster } from "@/components/ui/sonner";
import { Provider } from 'react-redux';
import store from './redux/Store';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import ThemeProvider from './components/ThemeProvider';
import axios from 'axios'; // ✅ Import axios directly here

// ✅ Global axios config (NO extra file needed)
axios.defaults.baseURL = "https://blog-platform-backend-crkc.onrender.com/api/v1";
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const persistor = persistStore(store);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </PersistGate>
    </Provider>
    <Toaster />
  </StrictMode>
);
