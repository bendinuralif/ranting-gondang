
const Intro = () => {
  return (
    <>
      <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-5 justify-items-center mx-8 sm:mx-24 md:mx-28 lg:mx-48 mb-10'>
        <div className='w-28 sm:w-40 md:w-48 h-28 sm:h-40 md:h-48 bg-white border-2 border-[red] flex flex-col justify-center gap-3 sm:gap-5 items-center text-center' style={{ borderRadius: 10 }}>
          <p className='text-3xl sm:text-5xl md:text-6xl font-bold text-red-600'>125 +</p>
          <p className='text-sm sm:text-xl md:text-2xl font-semibold'>SISWA</p>
        </div>
        <div className='w-28 sm:w-40 md:w-48 h-28 sm:h-40 md:h-48 bg-white border-2 border-[red] flex flex-col justify-center gap-3 sm:gap-5 items-center text-center' style={{ borderRadius: 10 }}>
          <p className='text-3xl sm:text-5xl md:text-6xl font-bold text-red-600'>35 +</p>
          <p className='text-sm sm:text-xl md:text-2xl font-semibold'>SUB RAYON</p>
        </div>
        <div className='w-28 sm:w-40 md:w-48 h-28 sm:h-40 md:h-48 bg-white border-2 border-[red] flex flex-col justify-center gap-3 sm:gap-5 items-center text-center' style={{ borderRadius: 10 }}>
          <p className='text-3xl sm:text-5xl md:text-6xl font-bold text-red-600'>1 +</p>
          <p className='text-sm sm:text-xl md:text-2xl font-semibold'>PUSDIKLAT</p>
        </div>
        <div className='w-28 sm:w-40 md:w-48 h-28 sm:h-40 md:h-48 bg-white border-2 border-[red] flex flex-col justify-center gap-3 sm:gap-5 items-center text-center' style={{ borderRadius: 10 }}>
          <p className='text-3xl sm:text-5xl md:text-6xl font-bold text-red-600'>9 +</p>
          <p className='text-sm sm:text-xl md:text-2xl font-semibold'>RAYON</p>
        </div>
      </div>
    </>
  );
};

export default Intro;