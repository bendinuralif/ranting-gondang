import React, { useState } from "react";
import logo from '../assets/img/Logo-2.png'; // Pastikan path ini benar
import { NavLink } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfilDropdownOpen, setIsProfilDropdownOpen] = useState(false);
  const [isDataDropdownOpen, setIsDataDropdownOpen] = useState(false);

  const handleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleProfilClick = () => {
    setIsProfilDropdownOpen(!isProfilDropdownOpen);
    setIsDataDropdownOpen(false);
  };

  const handleDataClick = () => {
    setIsDataDropdownOpen(!isDataDropdownOpen);
    setIsProfilDropdownOpen(false);
  };

  const linkClass = ({ isActive }) => isActive ? 
    "py-2 px-3 text-red-700 bg-red-700 rounded md:bg-transparent md:text-red-700 md:p-0 text-white hover:bg-gray-700 md:hover:bg-transparent" : 
    "block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-red-700 md:p-0 text-white md:hover:text-red-500 hover:bg-gray-700";

  return (
    <nav className="bg-black fixed top-0 left-0 right-0 z-50">
      <div className="max-w-screen-xl mx-auto flex flex-wrap items-center justify-between p-4">
        <a href="/" className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="h-12" />
        </a>
        <button onClick={handleNavbar} type="button" className="inline-flex items-center p-2 text-sm text-gray-400 rounded-lg md:hidden hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-gray-700" aria-controls="navbar-dropdown" aria-expanded={isOpen}>
          <span className="sr-only">Buka menu utama</span>
          <svg className={`w-6 h-6 transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
        <div className={`${isOpen ? "" : "hidden"} w-full md:block md:w-auto`} id="navbar-dropdown">
          <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
            <li>
              <NavLink to="/" className={linkClass} aria-current="page">Beranda</NavLink>
            </li>
            <Dropdown 
              title="Profil" 
              isOpen={isProfilDropdownOpen} 
              handleClick={handleProfilClick} 
              items={[
                { href: 'sejarah-singkat', text: 'Sejarah Singkat' },
                { href: 'ketua-ranting', text: 'Ketua Ranting' },
                { href: 'struktur-organisasi', text: 'Struktur Organisasi' },
                { href: 'tujuan', text: 'Tujuan' },
                { href: 'filosofi', text: 'Filosofi' },
                { href: 'falsafah', text: 'Falsafah' },
                { href: 'login', text: 'Login' }
              ]} 
            />
            <Dropdown 
              title="Data" 
              isOpen={isDataDropdownOpen} 
              handleClick={handleDataClick} 
              items={[
                { href: 'siswa', text: 'Siswa' },
                { href: 'warga', text: 'Warga' },
                { href: 'SubRayon', text: 'Sub Rayon' },
                { href: 'Pusdiklat', text: 'Pusdiklat' },
                { href: 'Rayon', text: 'Rayon' }
              ]} 
            />
            <li>
              <NavLink to="/kegiatan" className={linkClass}>Kegiatan</NavLink>
            </li>
            <li>
              <NavLink to="/berita" className={linkClass}>Berita</NavLink>
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

function Dropdown({ title, isOpen, handleClick, items }) {
  return (
    <li className="relative">
      <button 
        onClick={handleClick}
        className={`py-2 px-3 text-white rounded hover:bg-red-700 md:hover:bg-transparent md:border-0 md:p-0 md:hover:text-red-700 flex items-center justify-between w-full md:w-auto ${isOpen ? 'text-red-700' : ''}`}
      >
        {title}
        <svg className={`ml-2 w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      <div className={`${isOpen ? "block" : "hidden"} absolute z-10 w-48 bg-white shadow-md mt-2 rounded-md transition-opacity duration-300 ease-in-out`}>
        <ul className="py-1 text-sm text-gray-700">
          {items.map((item, index) => (
            <li key={index}><a href={item.href} className="block px-4 py-2 hover:bg-red-600 hover:text-white">{item.text}</a></li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export default Navbar;
