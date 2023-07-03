import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { DataProvider } from './ResultsContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
	     <DataProvider>
      <App />
    </DataProvider>
	</BrowserRouter>
   
);

