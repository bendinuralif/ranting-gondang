import React, { useState, useEffect } from 'react';
import Carousel1 from '../assets/img/01-min.png';
import Carousel2 from '../assets/img/02-min.png';
import Carousel3 from '../assets/img/03-min.png';
import Carousel4 from '../assets/img/04-min.png';

function CustomCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = [Carousel1, Carousel2, Carousel3, Carousel4];

  useEffect(() => {
    const timer = setTimeout(() => {
      goToNext();
    }, 15000); // Change slide every 15 seconds

    return () => clearTimeout(timer);
  }, [activeIndex]);

  const goToPrev = () => {
    const newIndex = activeIndex === 0 ? images.length - 1 : activeIndex - 1;
    setActiveIndex(newIndex);
  };

  const goToNext = () => {
    const newIndex = activeIndex === images.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(newIndex);
  };

  return (
    <div className="relative w-full pt-20">
      <div className="relative overflow-hidden h-80 sm:h-96 md:h-120 lg:h-144 xl:h-160">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              className="absolute inset-0 w-full h-full object-cover"
              alt={`Slide ${index + 1}`}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center h-full text-center text-white bg-black bg-opacity-0 p-4">
              <span className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold">PERSAUDARAAN SETIA HATI TERATE</span>
              <span className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold">RANTING GONDANG CABANG SRAGEN</span>
              <span className="text-xs sm:text-sm md:text-lg lg:text-xl font-semibold mt-2">“Dengan Pencak Silat Kita Berbudaya Dan Berprestasi”</span>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`w-3 h-3 rounded-full ${
              index === activeIndex ? 'bg-white' : 'bg-gray-300'
            }`}
            aria-label={`Slide ${index + 1}`}
            onClick={() => setActiveIndex(index)}
          ></button>
        ))}
      </div>
      <button
        type="button"
        className="absolute top-1/2 -translate-y-1/2 left-4 z-30 flex items-center justify-center w-10 h-10 bg-white bg-opacity-20 rounded-full hover:bg-opacity-50 focus:ring-4 focus:ring-white focus:outline-none mt-10 md:mt-10"
        onClick={goToPrev}
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>

      <button
        type="button"
        className="absolute top-1/2 -translate-y-1/2 right-4 z-30 flex items-center justify-center w-10 h-10 bg-white bg-opacity-20 rounded-full hover:bg-opacity-50 focus:ring-4 focus:ring-white focus:outline-none mt-10 md:mt-10"
        onClick={goToNext}
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    </div>
  );
}

export default CustomCarousel;
