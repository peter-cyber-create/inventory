import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from './Routes/App';
import store from "./store";
import './theme/moh-institutional-theme.css';
import './theme/moh-global-theme.css';
import './theme/moh-professional.css';
import './theme/moh-login.css';
import './theme/stores-module.css';
import './design-system/moh-forms.css';
import './assets/fonts/Inter/Inter-Regular.ttf';
import './assets/fonts/Inter/Inter-Bold.ttf';
import './assets/fonts/Inter/Inter-Medium.ttf';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
        <App />
    </BrowserRouter>
  </Provider>
);
