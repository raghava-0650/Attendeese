import React, { useState } from 'react';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errormsg, setErrormsg] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.priventDefault();

        try{
            const response = await axios.post('post request to backends signup route',{ username, password });

            if(response.status === 201 && response.data.token){
                //optionally store the token
                localStorage.setItem('token',response.data.token);

                //redirect them to home after successfully signup
                Navigate('/home');
            }
            

            
        }catch(error){

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
                <p className="text-slate-500 text-sm mt-6 leading-relaxed">Sign up to your account and start tracking your attendence.</p>
              </div>

              <div>
                <label className="text-slate-800 text-sm font-medium mb-2 block">Username</label>
                <div className="relative flex items-center">
                  <input value={username} onChange={(e) => setUsername(e.target.value)}
                  name="username" type="text" required className="w-full text-sm text-slate-800 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600" placeholder="Enter username" />
                </div>
              </div>
              <div>
                <label className="text-slate-800 text-sm font-medium mb-2 block">Password</label>
                <div className="relative flex items-center">
                  <input value={password} onChange={(e) => setPassword(e.target.value)} name="password" type="password" required className="w-full text-sm text-slate-800 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600" placeholder="Enter password" />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-slate-300 rounded" />
                  <label for="remember-me" className="ml-3 block text-sm text-slate-500">
                    Remember me
                  </label>
                </div>

                
              </div>

              <div className="!mt-12">
                <button type="submit" className="w-full shadow-xl py-2.5 px-4 text-[15px] font-medium tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                  Sign in
                </button>
                
              </div>
            </form>
          </div>

          <div className="max-md:mt-8">
            <img src="https://readymadeui.com/login-image.webp" class="w-full aspect-[71/50] max-md:w-4/5 mx-auto block object-cover" alt="login img" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup


