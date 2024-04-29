import React, { useState, useEffect } from 'react';


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
  return (
    <>
      <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-5 justify-items-center mx-8 sm:mx-24 md:mx-28 lg:mx-48 mb-10'>
        <a href='/siswa' className='w-28 sm:w-40 md:w-48 h-28 sm:h-40 md:h-48 bg-white border-2 border-[red] flex flex-col justify-center gap-3 sm:gap-5 items-center text-center' style={{ borderRadius: 10 }}>
          <AnimatedNumber value={125} />
          <p className='text-sm sm:text-xl md:text-2xl font-semibold'>SISWA</p>
        </a>
        <a href='/subrayon' className='w-28 sm:w-40 md:w-48 h-28 sm:h-40 md:h-48 bg-white border-2 border-[red] flex flex-col justify-center gap-3 sm:gap-5 items-center text-center' style={{ borderRadius: 10 }}>
          <AnimatedNumber value={65} />
          <p className='text-sm sm:text-xl md:text-2xl font-semibold'>SUB RAYON</p>
        </a>
        <div className='w-28 sm:w-40 md:w-48 h-28 sm:h-40 md:h-48 bg-white border-2 border-[red] flex flex-col justify-center gap-3 sm:gap-5 items-center text-center' style={{ borderRadius: 10 }}>
          <AnimatedNumber value={1} />
          <p className='text-sm sm:text-xl md:text-2xl font-semibold'>PUSDIKLAT</p>
        </div>
        <a href='/rayon' className='w-28 sm:w-40 md:w-48 h-28 sm:h-40 md:h-48 bg-white border-2 border-[red] flex flex-col justify-center gap-3 sm:gap-5 items-center text-center' style={{ borderRadius: 10 }}>
          <AnimatedNumber value={9} />
          <p className='text-sm sm:text-xl md:text-2xl font-semibold'>RAYON</p>
        </a>
      </div>
    </>
  );
};

export default Intro;
