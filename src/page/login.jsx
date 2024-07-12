import React, { useState } from 'react';
import galeri1 from '../assets/img/galeri-1.jpg'; // Ensure the path is correct
import { AdminLogin } from '../lib/firebase/service';

const Login = () => {
  const [niw, setNiw] = useState('');
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState(false);
  const [error, setError] = useState(null); // State for holding error message
  const [niwEmpty, setNiwEmpty] = useState(false); // State for NIW field validation
  const [passwordEmpty, setPasswordEmpty] = useState(false); // State for password field validation

  const handleNiwChange = (event) => {
    setNiw(event.target.value);
    if (event.target.value) {
      setNiwEmpty(false);
    }
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    if (event.target.value) {
      setPasswordEmpty(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    let valid = true;

    if (!niw) {
      setNiwEmpty(true);
      valid = false;
    }

    if (!password) {
      setPasswordEmpty(true);
      valid = false;
    }

    if (!valid) return;

    setLogin(true);
    try {
      const user = await AdminLogin(niw, password);
      console.log(user);
      if (user) {
        sessionStorage.setItem('user', JSON.stringify(user));
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error(error);
      setError('NIW dan password anda salah. Silahkan coba lagi.'); // Set error message
      setLogin(false); // Reset login state if there was an error
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left side with the form */}
      <div className="flex flex-1 flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md mx-auto">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Selamat Datang Di Admin PSHT Ranting Gondang!
          </h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="niw-address" className="sr-only">
                  NIW address
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
                  placeholder="NIW address"
                />
                {niwEmpty && (
                  <p className="text-red-500 text-xs mt-1">NIW harus diisi.</p>
                )}
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
                {passwordEmpty && (
                  <p className="text-red-500 text-xs mt-1">Password harus diisi.</p>
                )}
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
                disabled={login} // Disable button while logging in
              >
                Masuk
              </button>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={handleBack}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Kembali
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
          <p className="text-xl text-white">Choose Your Chatroom</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
