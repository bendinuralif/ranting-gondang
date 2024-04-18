import React, { useState } from 'react';
import Layout from './Layout';
import galeri1 from '../assets/img/galeri-1.jpg';
import galeri2 from '../assets/img/galeri-2.jpg';


const GalleryPage = () => {
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [enlargedImageTitle, setEnlargedImageTitle] = useState('');
  const [activeButton, setActiveButton] = useState(null); // State untuk menyimpan tombol yang aktif
  const [filteredImages, setFilteredImages] = useState([]); // State untuk menyimpan gambar yang difilter

  // Data gambar dengan nama dan tahun
  const images = [
    { src: galeri1, title: 'Gambar 1', year: 2021 },
    { src: galeri2, title: 'Gambar 2', year: 2021 },
    { src: galeri1, title: 'Gambar 3', year: 2022 },
    { src: galeri2, title: 'Gambar 4', year: 2022 },
    // Tambahkan objek lain sesuai kebutuhan
  ];

  // Fungsi untuk menampilkan gambar yang diperbesar saat diklik
  const handleImageClick = (imageSrc, imageTitle) => {
    setEnlargedImage(imageSrc);
    setEnlargedImageTitle(imageTitle);
  };

  // Fungsi untuk menyembunyikan gambar yang diperbesar
  const handleCloseEnlargedImage = () => {
    setEnlargedImage(null);
    setEnlargedImageTitle('');
  };

  // Fungsi untuk menangani klik tombol filter
  const handleButtonClick = (buttonValue) => {
    setActiveButton(buttonValue);
    // Filter gambar berdasarkan tahun yang dipilih
    const filteredImages = buttonValue ? images.filter(image => image.year === buttonValue) : images;
    setFilteredImages(filteredImages);
  };

  return (
    <div>
      <Layout>
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

        {/* Galeri gambar */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10 px-10">
          {/* Looping untuk menampilkan gambar */}
          {filteredImages.map((image, index) => (
            <div key={index} onClick={() => handleImageClick(image.src, image.title)}>
              <img className="w-full h-auto rounded-lg cursor-pointer" src={image.src} alt={image.title} />
              <div className="text-center mt-2">{image.title} - {image.year}</div>
            </div>
          ))}
        </div>
        {/* Tampilan gambar yang diperbesar */}
        {enlargedImage && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center" onClick={handleCloseEnlargedImage}>
            <div className="mx-5 max-w-full max-h-full" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <button className="absolute top-4 right-4 text-white text-2xl" onClick={handleCloseEnlargedImage}>×</button>
              <img className="max-w-full max-h-full" style={{ borderRadius: 10, maxWidth: '90vw' }} src={enlargedImage} alt={enlargedImageTitle} />
              <div className="text-white absolute bottom-4 left-4">{enlargedImageTitle}</div>
            </div>
          </div>
        )}
      </Layout>
    </div>
  );
}

export default GalleryPage;
