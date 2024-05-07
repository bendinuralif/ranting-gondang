import React, { useState } from 'react';
import galeri1 from '../assets/img/galeri-1.jpg'; // Ensure the path is correct
import { AdminLogin } from '../lib/firebase/service'

const Login = () => {
  const [niw, setNiw] = useState('');
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState('');

  const handleNiwChange = (event) => {
    setNiw(event.target.value);
    
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    
  };

  const handleLogin = async (e) => {
    e.preventDefault()
    setLogin (true)
    const user = await AdminLogin(niw, password)
    console.log (user)
    if (user){
      sessionStorage.setItem('user', JSON.stringify(user));
      window.location.href = '/dashboard';
    }
  }
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left side with the form */}
      <div className="flex flex-1 flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md mx-auto">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Selamat Datang Di Admin PSHT Ranting Gondang!
          </h2>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                onChange={handleNiwChange}
                  id="niw-address"
                  name="niw"
                  type="text"
                  value={niw}
                  autoComplete="niw"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="niw address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                onChange={handlePasswordChange}
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>


            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right side with the image */}
      <div className="relative w-1/2 hidden lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={galeri1}
          alt="People smiling"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black opacity-50"></div>
        <div className="absolute bottom-10 left-10">
          <h3 className="text-4xl font-bold text-white">Get Started!</h3>
          <p className="text-xl text-white">
            Choose Your Chatroom
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
