import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

setInterval(() => {
  console.log('I am awake!!!');
}, 900000);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
