import React from 'react';
import ReactDOM from 'react-dom/client';
import './Stylesheets/index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './ThemContext';

const root = ReactDOM.createRoot(document.getElementById('root'))


root.render(
    <BrowserRouter>
        <ThemeProvider>
            <App />
        </ThemeProvider>
    </BrowserRouter>
);

reportWebVitals();