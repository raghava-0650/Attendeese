// src/pages/Login.jsx
import React, { useState } from 'react';

import { signInWithEmailAndPassword } from 'firebase/auth';
import {
  Link,
  useNavigate,
} from 'react-router-dom';

import { auth } from '../firebase'; // adjust path based on your file structure

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login successful!');
      navigate('/subjects'); // make sure this route exists
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  return (
    <div className='bg-gray-50'>
      <div className='min-h-screen flex flex-col items-center justify-center py-6 px-4'>
        <div className='p-8 rounded-2xl bg-white shadow'>
          <h2 className='text-slate-900 text-center text-3xl font-semibold'>Login</h2>
          <form onSubmit={handleLogin} className='mt-12 space-y-6'>
            <div>
              <label className='text-sm font-medium mb-2 block text-slate-800'>Email</label>
              <input
                className='w-full text-slate-800 text-sm border border-slate-300 px-4 py-3 rounded-md outline-blue-600'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='enter email'
                required
              />
            </div>
            <div>
              <label className='text-sm font-medium mb-2 block text-slate-800'>Password</label>
              <input
                className='w-full text-slate-800 text-sm border border-slate-300 px-4 py-3 rounded-md outline-blue-600'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='enter password'
                required
              />
            </div>
            <div className='flex items-center'>
              <input type="checkbox" className='mr-2 h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-slate-300 rounded' id='remember-me' />
              <label htmlFor='remember-me' className='text-sm font-medium text-slate-800'>Remember me</label>
            </div>
            <div className='!mt-12'>
              <button type="submit" className='w-full py-2 px-4 text-[15px] font-medium tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none'>
                Login
              </button>
              <p className="text-sm !mt-6 text-center text-slate-500">
                Don't have an account?
                <Link to="/signup" className="text-blue-600 font-medium hover:underline ml-1 whitespace-nowrap">Signup here</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
