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
  const [latestYear, setLatestYear] = useState(0); // State untuk menyimpan tahun terbaru

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
        setLatestYear(availableYears[0]); // Atur tahun terbaru
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
      <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-5 justify-items-center mx-8 sm:mx-24 md:mx-28 lg:mx-48 mb-10'>
      <a href='/siswa' className='w-28 sm:w-40 md:w-48 h-28 sm:h-40 md:h-48 bg-white border-2 border-[red] flex flex-col justify-center gap-2 sm:gap-3 items-center text-center' style={{ borderRadius: 10 }}>
  <AnimatedNumber value={siswaCount} />
  <p className='text-sm sm:text-xl md:text-2xl font-semibold'>SISWA</p>
  <p className='text-sm sm:text-xl md:text-2xl font-semibold' style={{ marginTop: '-15px' }}>Tahun {latestYear}</p>
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
