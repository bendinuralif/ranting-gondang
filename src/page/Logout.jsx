import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    // Clear user data from session storage
    sessionStorage.removeItem('user');
    
    // Redirect to the login page
    navigate('/');
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <button
        onClick={openModal}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Logout
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Apakah anda yakin logout?</h2>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="mr-2 px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logout;
