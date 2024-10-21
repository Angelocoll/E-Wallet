import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import store from './store/store.js';


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  
      <App />
   
  </Provider>
);
