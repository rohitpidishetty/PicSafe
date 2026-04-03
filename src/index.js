import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Picture from './Picture';
import Login from './Login';
import Main from './Main';
import Storage from './Storage';
import SignUp from './SignUp';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { defineCustomElements } from '@ionic/pwa-elements/loader';


defineCustomElements(window);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/main' element={<Main />} />
        <Route path='/gallery-store' element={<Storage />} />
        <Route path='/picture' element={<Picture />} />
        <Route path='/signup' element={<SignUp />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

