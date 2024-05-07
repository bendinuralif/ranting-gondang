import React from 'react';
import PropTypes from 'prop-types';
import Footer from '../component/footer'; // Pastikan nama file dan path-nya benar
import CustomSidebar from '../component/sidebar'; // Pastikan nama file dan path-nya benar
import CustomNavbar from '../component/navbar'; // Pastikan nama file dan path-nya benar
import { useState } from 'react';

const LayoutAdmin = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false); // Mengatur isOpen menjadi true secara default

  // Fungsi untuk menampilkan atau menyembunyikan sidebar
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };


  return (
    <div className='min-h-screen flex flex-col'>
      {/* Navbar */}
      <CustomNavbar toggleSidebar={toggleSidebar} />

      {/* Content */}
      <div className="flex-grow flex">
        {/* Sidebar */}
        <CustomSidebar isOpen={isOpen}/>

        {/* Main content */}
        <div className="flex-grow">{children}</div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

LayoutAdmin.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LayoutAdmin;
