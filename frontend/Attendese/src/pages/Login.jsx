import React from 'react';

const Login = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

  return (
    <div className='bg-gray-50'>
        <div className='min-h-screen flex flex-col items-center justify-center py-6 px-4'>
            <div className='p-8 rounded-2xl bg-white shadow'>
                <h2 className='text-slate-900 text-center text-3xl font-semibold'>Login</h2>
                <form className='mt-12 space-y-6'>
                    <div>
                        <label className='text-sm font-medium mb-2 block text-slate-800'>Username</label>
                        <input className='w-full text-slate-800 text-sm border border-slate-300 px-4 py-3 rounded-md outline-blue-600' type='text' placeholder='enter email' required></input>
                    </div>
                    <div>
                        <label className='text-sm font-medium mb-2 block text-slate-800'>Password</label>
                        <input className='w-full text-slate-800 text-sm border border-slate-300 px-4 py-3 rounded-md outline-blue-600' type='password' placeholder='enter password'></input>
                    </div>
                    <div className='flex items-center'>
                        <input type="checkbox" className='mr-2 h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-slate-300 rounded' id='remember-me' name='remember-me'></input>
                        <label htmlFor='remember' className='text-sm font-medium text-slate-800'>Remember me</label>
                    </div>
                    <div className='!mt-12'>
                        <button type="submit" className='w-full py-2 px-4 text-[15px] font-medium tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none'>Login</button>
                    </div>
                    
                </form>
            </div>
            
        </div>
    </div>
  )
}

export default Login