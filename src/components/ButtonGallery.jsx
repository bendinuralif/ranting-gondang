import React, { useState } from 'react';
import Layout from '../page/Layout';
import Gallery2021 from '../components/Gallery2021';
import Gallery2022 from '../components/Gallery2022';
import Gallery2023 from '../components/Gallery2023';
import Gallery2024 from '../components/Gallery2024';

const ButtonGallery = () => {
  const [activeButton, setActiveButton] = useState(null);

  const handleButtonClick = (year) => {
    setActiveButton(year);
  };

  return (
    <div>
      <div className="flex items-center justify-center py-4 md:py-8 flex-wrap mt-20">
        <button
          className={`text-sm md:text-xl font-medium px-5 py-2.5 text-center me-3 mb-3 focus:ring-4 focus:outline-none rounded-full 
            ${activeButton === null ? 'bg-gray-700 text-white' : 'bg-white text-gray-900 border border-white hover:border-gray-200 hover:bg-red-700 hover:text-white'}
          `}
          onClick={() => handleButtonClick(null)}
        >
          Semua
        </button>
        <button
          className={`text-sm md:text-xl font-medium px-5 py-2.5 text-center me-3 mb-3 focus:ring-4 focus:outline-none rounded-full 
            ${activeButton === 2024 ? 'bg-gray-700 text-white' : 'bg-white text-gray-900 border border-white hover:border-gray-200 hover:bg-red-700 hover:text-white'}
          `}
          onClick={() => handleButtonClick(2024)}
        >
          2024
        </button>
        <button
          className={`text-sm md:text-xl font-medium px-5 py-2.5 text-center me-3 mb-3 focus:ring-4 focus:outline-none rounded-full 
            ${activeButton === 2023 ? 'bg-gray-700 text-white' : 'bg-white text-gray-900 border border-white hover:border-gray-200 hover:bg-red-700 hover:text-white'}
          `}
          onClick={() => handleButtonClick(2023)}
        >
          2023
        </button>
        <button
          className={`text-sm md:text-xl font-medium px-5 py-2.5 text-center me-3 mb-3 focus:ring-4 focus:outline-none rounded-full 
            ${activeButton === 2022 ? 'bg-gray-700 text-white' : 'bg-white text-gray-900 border border-white hover:border-gray-200 hover:bg-red-700 hover:text-white'}
          `}
          onClick={() => handleButtonClick(2022)}
        >
          2022
        </button>
        <button
          className={`text-sm md:text-xl font-medium px-5 py-2.5 text-center me-3 mb-3 focus:ring-4 focus:outline-none rounded-full 
            ${activeButton === 2021 ? 'bg-gray-700 text-white' : 'bg-white text-gray-900 border border-white hover:border-gray-200 hover:bg-red-700 hover:text-white'}
          `}
          onClick={() => handleButtonClick(2021)}
        >
          2021
        </button>
      </div>

      <div className="flex flex-wrap justify-center mt-8">
        {(activeButton === null || activeButton === 2021) && <Gallery2021 />}
        {(activeButton === null || activeButton === 2022) && <Gallery2022 />}
        {(activeButton === null || activeButton === 2023) && <Gallery2023 />}
        {(activeButton === null || activeButton === 2024) && <Gallery2024 />}
      </div>
    </div>
  );
}

export default ButtonGallery;
