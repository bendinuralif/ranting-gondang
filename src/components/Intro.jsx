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
  const [siswaCount, setSiswaCount] = useState(0); // State untuk menyimpan jumlah siswa

  useEffect(() => {
    const fetchSubRayonCount = async () => {
      try {
        const subRayonData = await retrieveData('SubRayon');
        setSubRayonCount(subRayonData.length);
      } catch (error) {
        console.error("Error fetching sub rayon count:", error);
      }
    };

    const fetchRayonCount = async () => {
      try {
        const rayonData = await retrieveData('Rayon');
        setRayonCount(rayonData.length);
      } catch (error) {
        console.error("Error fetching rayon count:", error);
      }
    };

    const fetchPusdiklatCount = async () => {
      try {
        const pusdiklatData = await retrieveData('Pusdiklat');
        setPusdiklatCount(pusdiklatData.length);
      } catch (error) {
        console.error("Error fetching pusdiklat count:", error);
      }
    };

    const fetchSiswaCount = async () => {
      try {
        const siswaData = await retrieveData('Siswa');
        setSiswaCount(siswaData.length);
      } catch (error) {
        console.error("Error fetching siswa count:", error);
      }
    };

    fetchSubRayonCount();
    fetchRayonCount();
    fetchPusdiklatCount();
    fetchSiswaCount(); // Panggil fungsi untuk mengambil jumlah siswa
  }, []);

  return (
    <>
      <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-5 justify-items-center mx-8 sm:mx-24 md:mx-28 lg:mx-48 mb-10'>
        <a href='/siswa' className='w-28 sm:w-40 md:w-48 h-28 sm:h-40 md:h-48 bg-white border-2 border-[red] flex flex-col justify-center gap-3 sm:gap-5 items-center text-center' style={{ borderRadius: 10 }}>
          <AnimatedNumber value={siswaCount} />
          <p className='text-sm sm:text-xl md:text-2xl font-semibold'>SISWA</p>
        </a>
        <a href='/subrayon' className='w-28 sm:w-40 md:w-48 h-28 sm:h-40 md:h-48 bg-white border-2 border-[red] flex flex-col justify-center gap-3 sm:gap-5 items-center text-center' style={{ borderRadius: 10 }}>
          <AnimatedNumber value={subRayonCount} />
          <p className='text-sm sm:text-xl md:text-2xl font-semibold'>SUB RAYON</p>
        </a>
        <a href='/pusdiklat' className='w-28 sm:w-40 md:w-48 h-28 sm:h-40 md:h-48 bg-white border-2 border-[red] flex flex-col justify-center gap-3 sm:gap-5 items-center text-center' style={{ borderRadius: 10 }}>
          <AnimatedNumber value={pusdiklatCount} />
          <p className='text-sm sm:text-xl md:text-2xl font-semibold'>PUSDIKLAT</p>
        </a>
        <a href='/rayon' className='w-28 sm:w-40 md:w-48 h-28 sm:h-40 md:h-48 bg-white border-2 border-[red] flex flex-col justify-center gap-3 sm:gap-5 items-center text-center' style={{ borderRadius: 10 }}>
          <AnimatedNumber value={rayonCount} />
          <p className='text-sm sm:text-xl md:text-2xl font-semibold'>RAYON</p>
        </a>
      </div>
    </>
  );
};

export default Intro;
