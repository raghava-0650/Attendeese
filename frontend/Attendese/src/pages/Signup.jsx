// src/pages/Signup.jsx
import React, { useState } from 'react';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import {
  doc,
  setDoc,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

import {
  auth,
  db,
} from '../firebase'; // adjust the path if needed

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errormsg, setErrormsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrormsg('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Save user to Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        createdAt: new Date()
      });

      alert('Signup successful!');
      navigate('/subjects');
    } catch (error) {
      setErrormsg(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="py-6 px-4">
        <div className="grid md:grid-cols-2 items-center gap-6 max-w-6xl w-full">
          <div className="border border-slate-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="mb-12">
                <h3 className="text-slate-900 text-3xl font-semibold">Sign up</h3>
                <p className="text-slate-500 text-sm mt-6 leading-relaxed">
                  Sign up to your account and start tracking your attendance.
                </p>
              </div>

              {errormsg && (
                <div className="text-red-500 text-sm mb-4">{errormsg}</div>
              )}

              <div>
                <label className="text-slate-800 text-sm font-medium mb-2 block">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  name="email"
                  type="email"
                  required
                  className="w-full text-sm text-slate-800 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="text-slate-800 text-sm font-medium mb-2 block">Password</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  name="password"
                  type="password"
                  required
                  className="w-full text-sm text-slate-800 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600"
                  placeholder="Enter password"
                />
              </div>

              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-slate-300 rounded" />
                <label htmlFor="remember-me" className="ml-3 block text-sm text-slate-500">
                  Remember me
                </label>
              </div>

              <div className="!mt-12">
                <button type="submit" className="w-full shadow-xl py-2.5 px-4 text-[15px] font-medium tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                  Sign up
                </button>  
              </div>
            </form>
          </div>

          <div className="max-md:mt-8">
            <img
              src="https://readymadeui.com/login-image.webp"
              className="w-full aspect-[71/50] max-md:w-4/5 mx-auto block object-cover"
              alt="signup"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
