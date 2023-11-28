import React from 'react';
import ReactDOM from 'react-dom/client';
import './Stylesheets/index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import Modal from 'react-modal'

const root = ReactDOM.createRoot(document.getElementById('root'));

// Modal.setAppElement(root)

root.render(  
    <BrowserRouter>
        <App /> 
    </BrowserRouter>
);

reportWebVitals();