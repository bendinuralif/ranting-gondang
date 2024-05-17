import React, { useState } from "react";
import logo from '../assets/img/Logo.png'; // Pastikan path ini benar
import { NavLink } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfilDropdownOpen, setIsProfilDropdownOpen] = useState(false);
  const [isDataDropdownOpen, setIsDataDropdownOpen] = useState(false);

  const handleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const toggleProfilDropdown = () => {
    setIsProfilDropdownOpen(!isProfilDropdownOpen);
    setIsDataDropdownOpen(false); // Tutup dropdown data saat membuka dropdown profil
  };

  const toggleDataDropdown = () => {
    setIsDataDropdownOpen(!isDataDropdownOpen);
    setIsProfilDropdownOpen(false); // Tutup dropdown profil saat membuka dropdown data
  };

  // Kustomisasi className berdasarkan apakah link aktif atau tidak
  const linkClass = ({ isActive }) => isActive ? "py-2 px-3 text-red-700 bg-red-700 rounded md:bg-transparent md:text-red-700 md:p-0 text-white hover:bg-gray-700 md:hover:bg-transparent" : "block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-red-700 md:p-0 text-white md:hover:text-red-500 hover:bg-gray-700";

  return (
    <nav className="bg-black fixed top-0 left-0 right-0 z-50">
      <div className="max-w-screen-xl mx-auto flex flex-wrap items-center justify-between p-4">
        <a href="/" className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="h-12" />
          <span className="self-center text-l md:text-xl font-semibold whitespace-nowrap text-white">PSHT RANTING GONDANG</span>
        </a>
        <button onClick={handleNavbar} data-collapse-toggle="navbar-dropdown" type="button" className="inline-flex items-center p-2 text-sm text-gray-400 rounded-lg md:hidden hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-gray-700" aria-controls="navbar-dropdown" aria-expanded="false">
          <span className="sr-only">Buka menu utama</span>
          {/* Icon untuk menu */}
          <svg className={`w-6 h-6 transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
        </button>
        <div className={`${isOpen ? "" : "hidden"} w-full md:block md:w-auto`} id="navbar-dropdown">
          <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
            <li>
              <NavLink to="/" className={linkClass} aria-current="page">Beranda</NavLink>
            </li>
            <li className="relative">
              <button onClick={toggleProfilDropdown} className={`py-2 px-3 text-white rounded hover:bg-red-700 md:hover:bg-transparent md:border-0 md:p-0 md:hover:text-red-700 flex items-center justify-between w-full md:w-auto ${isProfilDropdownOpen ? 'text-red-700' : ''}`}>
                Profil
                {/* Icon dropdown */}
                <svg className={`ml-2 w-4 h-4 transition-transform ${isProfilDropdownOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              <div className={`${isProfilDropdownOpen ? "block" : "hidden"} absolute z-10 w-48 bg-white shadow-md mt-2 rounded-md`}>
                <ul className="py-1 text-sm text-gray-700 ">
                  <li><a href="sejarah-singkat" className="block px-4 py-2 hover:bg-red-600 hover:text-white">Sejarah Singkat</a></li>
                  <li><a href="struktur-organisasi" className="block px-4 py-2 hover:bg-red-600 hover:text-white">Struktur Organisasi</a></li>
                  <li><a href="tujuan" className="block px-4 py-2 hover:bg-red-600 hover:text-white">Tujuan</a></li>
                  <li><a href="filosofi" className="block px-4 py-2 hover:bg-red-600 hover:text-white">Filosofi</a></li>
                  <li><a href="falsafah" className="block px-4 py-2 hover:bg-red-600 hover:text-white">Falsafah</a></li>
                  <li><a href="login" className="block px-4 py-2 hover:bg-red-600 hover:text-white">Login</a></li>
                </ul>
              </div>
            </li>
            <li className="relative">
              <button onClick={toggleDataDropdown} className={`py-2 px-3 text-white rounded hover:bg-red-700 md:hover:bg-transparent md:border-0 md:p-0 md:hover:text-red-700 flex items-center justify-between w-full md:w-auto ${isDataDropdownOpen ? 'text-red-700' : ''}`}>
                Data
                {/* Icon dropdown */}
                <svg className={`ml-2 w-4 h-4 transition-transform ${isDataDropdownOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              <div className={`${isDataDropdownOpen ? "block" : "hidden"} absolute z-10 w-48 bg-white shadow-md mt-2 rounded-md`}>
                <ul className="py-1 text-sm text-gray-700 ">
                  <li><a href="siswa" className="block px-4 py-2 hover:bg-red-600 hover:text-white">Siswa</a></li>
                  <li><a href="#" className="block px-4 py-2 hover:bg-red-600 hover:text-white">Warga</a></li>
                  <li><a href="SubRayon" className="block px-4 py-2 hover:bg-red-600 hover:text-white">Sub Rayon</a></li>
                  <li><a href="Pusdiklat" className="block px-4 py-2 hover:bg-red-600 hover:text-white">Pusdiklat</a></li>
                  <li><a href="Rayon" className="block px-4 py-2 hover:bg-red-600 hover:text-white">Rayon</a></li>
                </ul>
              </div>
            </li>
            <li>
              <NavLink to="/kegiatan" className={linkClass}>Kegiatan</NavLink>
            </li>
            <li>
              <NavLink to="/layanan" className={linkClass}>Layanan</NavLink>
            </li>
            <li>
              <NavLink to="/gallery" className={linkClass}>Galeri</NavLink>
            </li>
            <li>
              <NavLink to="/kontak" className={linkClass}>Kontak</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

