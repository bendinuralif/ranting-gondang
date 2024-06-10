import React, { useState, useEffect } from 'react';
import { retrieveData } from "../lib/firebase/service";

const AnimatedNumber = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayValue((prev) => (prev < value ? prev + 1 : value));
    }, 70); // Interval time in milliseconds, adjust as needed

    return () => clearInterval(interval);
  }, [value]);

  return (
    <p className='text-3xl sm:text-5xl md:text-6xl font-bold text-red-600'>
      {displayValue}+
    </p>
  );
};

const Intro = () => {
  const [subRayonCount, setSubRayonCount] = useState(0);
  const [rayonCount, setRayonCount] = useState(0);
  const [pusdiklatCount, setPusdiklatCount] = useState(0);
  const [siswaCount, setSiswaCount] = useState(0); // State for storing the number of students
  const [latestYear, setLatestYear] = useState(0); // State for storing the latest year

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const subRayonData = await retrieveData('SubRayon');
        setSubRayonCount(subRayonData.length);

        const rayonData = await retrieveData('Rayon');
        setRayonCount(rayonData.length);

        const pusdiklatData = await retrieveData('Pusdiklat');
        setPusdiklatCount(pusdiklatData.length);

        const siswaData = await retrieveData('Siswa');
        const availableYears = Array.from(new Set(siswaData.map(item => item.tahun))).sort((a, b) => b - a);
        setLatestYear(availableYears[0]); // Set the latest year
        const latestYearSiswaData = siswaData.filter(item => item.tahun === availableYears[0]);
        setSiswaCount(latestYearSiswaData.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <>
      <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-5 justify-items-center mx-4 sm:mx-8 md:mx-16 lg:mx-24 xl:mx-32 mb-10'>
        <a href='/siswa' className='w-full max-w-xs h-40 bg-white border-2 border-red-600 flex flex-col justify-center items-center text-center rounded-lg shadow-md transition-transform transform hover:scale-105'>
          <AnimatedNumber value={siswaCount} />
          <p className='text-sm sm:text-lg md:text-xl font-semibold'>SISWA</p>
          <p className='text-xs sm:text-base md:text-lg font-semibold mt-[-5px]'>Tahun {latestYear}</p>
        </a>
        <a href='/subrayon' className='w-full max-w-xs h-40 bg-white border-2 border-red-600 flex flex-col justify-center items-center text-center rounded-lg shadow-md transition-transform transform hover:scale-105'>
          <AnimatedNumber value={subRayonCount} />
          <p className='text-sm sm:text-lg md:text-xl font-semibold'>SUB RAYON</p>
        </a>
        <a href='/pusdiklat' className='w-full max-w-xs h-40 bg-white border-2 border-red-600 flex flex-col justify-center items-center text-center rounded-lg shadow-md transition-transform transform hover:scale-105'>
          <AnimatedNumber value={pusdiklatCount} />
          <p className='text-sm sm:text-lg md:text-xl font-semibold'>PUSDIKLAT</p>
        </a>
        <a href='/rayon' className='w-full max-w-xs h-40 bg-white border-2 border-red-600 flex flex-col justify-center items-center text-center rounded-lg shadow-md transition-transform transform hover:scale-105'>
          <AnimatedNumber value={rayonCount} />
          <p className='text-sm sm:text-lg md:text-xl font-semibold'>RAYON</p>
        </a>
      </div>
    </>
  );
};

export default Intro;
