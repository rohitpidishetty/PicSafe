import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Login from './Login';
import SignUp from './SignUp';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './Main';
import Storage from './Storage';
import Picture from './Picture';
import { defineCustomElements } from '@ionic/pwa-elements/loader';


defineCustomElements(window);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/main' element={<Main />} />
        <Route path='/gallery-store' element={<Storage />} />
        <Route path='/picture' element={<Picture />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

