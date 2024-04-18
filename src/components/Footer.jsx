import React from 'react';
import { BsInstagram, BsEnvelope } from "react-icons/bs";
import logo from '../assets/img/Logo.png'

function CustomFooter() {
  return (
    <footer className="bg-black">
      <div className="container mx-auto px-2 py-3 md:py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="w-full sm:w-auto mb-2 md:mb-2 sm:mb-0 text-center sm:text-left">
            <a href="/" className="inline-flex items-center" target="_blank" rel="noopener noreferrer">
              <img src={logo} alt="Flowbite Logo" title="RANTING GONDANG" className="h-10 " />
              <span className="text-white text-l md:text-xl ml-2 font-bold">RANTING GONDANG</span>
            </a>
          </div>
          <div className="flex space-x-10">
            <a href="https://www.instagram.com/psht.ranting_gondang/" className="text-white">
              <BsInstagram size={30}  /> {/* Adjust the size as needed */}
            </a>
            {/* <a href="#" className="text-white">
              <BsTwitter size={30} />
            </a>
            <a href="#" className="text-white">
              <BsGithub size={30} />
            </a> */}
            <a href="mailto:rantinggondang@gmail.com" className="text-white">
              <BsEnvelope size={30} /> {/* Adjust the size as needed */}
            </a>
          </div>
        </div>
        <hr className="border-gray-700 my-2 mb-4" />
        <div className="text-center text-gray-400 text-xs md:text-sm">
          &copy; PSHT Ranting Gondang™ 2024
        </div>
      </div>
    </footer>
  );
}

export default CustomFooter;
