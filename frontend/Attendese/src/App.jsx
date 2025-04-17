import React from 'react';

import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';

import Landingpage from './pages/Landingpage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Subjects from './pages/Subjects';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landingpage />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/subjects' element={<Subjects />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
