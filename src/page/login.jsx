import React, { useState } from 'react';

const Login = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password, rememberMe });
  };

  return (
    <div className="bg-gray-100 p-6 rounded-md shadow-md">
      <h2 className="text-xl font-medium mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
          <input type="email" name="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 mb-1">Password</label>
          <input type="password" name="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
        </div>
        <div className="flex items-center mb-4">
          <input type="checkbox" name="rememberMe" id="rememberMe" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="mr-2" />
          <label htmlFor="rememberMe" className="text-gray-700">Remember me</label>
        </div>
        <div className="mb-4">
          <button type="submit" className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:shadow-outline-indigo">Login Now</button>
        </div>
        <div className="text-center">
          <p className="text-gray-700">Don't have an account? <a href="/signup" className="text-indigo-500 underline">Sign up</a></p>
          <p className="text-gray-700"><a href="/forgot-password" className="text-indigo-500 underline">Forgot password?</a></p>
        </div>
      </form>
    </div>
  );
};

export default Login;