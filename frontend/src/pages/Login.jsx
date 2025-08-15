import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
const Login = () => {
  const [state, setState] = useState('Sign Up');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const user = {
      email,
      password,
      name
    };

  }
  return (
    <form className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 items-start m-auto min-w-[340px] sm:min-w-96 border border-zinc-300 text-sm shadow-xl p-8 rounded-md'>
        <p className='text-2xl font-semibold'>{state === 'Sign Up' ? "Create Account" : "Login"}</p>
        <p>Please {state === 'Sign Up' ? "sign-up" : "login"} to book appointment</p>
        {
          state === "Sign Up" &&
          <div className='w-full'>
            <p>Full Name</p>
            <input className='border border-zinc-300 rounded-md w-full p-2 mt-1' type="text" onChange={(e) => setName(e.target.name)} value={name} required />
          </div>
        }

        <div className='w-full'>
          <p>Email</p>
          <input className='border border-zinc-300 rounded-md w-full p-2 mt-1' type="email" onChange={(e) => setEmail(e.target.name)} value={email} required />
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input className='border border-zinc-300 rounded-md w-full p-2 mt-1' type="password" onChange={(e) => setPassword(e.target.name)} value={password} required />
        </div>
        <button className='border w-full rounded-md border-primary bg-primary text-white px-6 py-3 mt-3 hover:bg-white hover:text-primary' >{state === 'Sign Up' ? "Create Account" : "Login"}</button>
        {
          state === "Sign Up"
            ? <p className='text-sm text-gray-500'>Already have an account? <span onClick={() => setState('Login')} className='text-primary cursor-pointer'>Login</span></p>
            : <p className='text-sm text-gray-500'>Don't have an account? <span onClick={() => setState('Sign Up')} className='text-primary cursor-pointer'>Create Account</span></p>
        }
      </div>
    </form>
  )
}

export default Login
