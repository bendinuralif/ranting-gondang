import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear user data from session storage
    sessionStorage.removeItem('user');
    
    // Redirect to the login page
    navigate('/login');
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-extrabold text-gray-900">Logging out...</h1>
    </div>
  );
};

export default Logout;
