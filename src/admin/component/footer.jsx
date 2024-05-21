import React from 'react';
import { BsInstagram, BsEnvelope } from "react-icons/bs";

function CustomFooter() {
  return (
    <footer className="bg-black">
      <div className="container mx-auto py-3 md:py-4">
        
        <hr className="border-gray-700 my-2 mb-4" />
        <div className="text-center text-gray-400 text-xs md:text-sm">
          &copy; PSHT Ranting Gondang™ 2024
        </div>
      </div>
    </footer>
  );
}

export default CustomFooter;
