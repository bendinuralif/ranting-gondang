import React, { useState } from 'react';
import Layout from './Layout';
import galeri1 from '../assets/img/galeri-1.jpg';
import galeri2 from '../assets/img/galeri-2.jpg';

const GalleryPage = () => {
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [enlargedImageTitle, setEnlargedImageTitle] = useState('');

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

  return (
    <div>
      <Layout>
      <div className="flex items-center justify-center py-4 md:py-8 flex-wrap mt-20">
          <button type="button" className="text-blue-700 hover:text-white border border-blue-600 bg-white hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-full text-sm md:text-xl font-medium px-5 py-2.5 text-center me-3 mb-3 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:bg-gray-900 dark:focus:ring-blue-800">Semua</button>
          <button type="button" className="text-gray-900 border border-white hover:border-gray-200 dark:border-gray-900 dark:bg-gray-900 dark:hover:border-gray-700 bg-white focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-full text-sm md:text-xl font-medium px-5 py-2.5 text-center me-3 mb-3 dark:text-white dark:focus:ring-gray-800">2024</button>
          <button type="button" className="text-gray-900 border border-white hover:border-gray-200 dark:border-gray-900 dark:bg-gray-900 dark:hover:border-gray-700 bg-white focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-full text-sm md:text-xl font-medium px-5 py-2.5 text-center me-3 mb-3 dark:text-white dark:focus:ring-gray-800">2023</button>
          <button type="button" className="text-gray-900 border border-white hover:border-gray-200 dark:border-gray-900 dark:bg-gray-900 dark:hover:border-gray-700 bg-white focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-full text-sm md:text-xl font-medium px-5 py-2.5 text-center me-3 mb-3 dark:text-white dark:focus:ring-gray-800">2022</button>
          <button type="button" className="text-gray-900 border border-white hover:border-gray-200 dark:border-gray-900 dark:bg-gray-900 dark:hover:border-gray-700 bg-white focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-full text-sm md:text-xl font-medium px-5 py-2.5 text-center me-3 mb-3 dark:text-white dark:focus:ring-gray-800">2021</button>
        </div>

        {/* Galeri gambar */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10 px-10">
          {/* Looping untuk menampilkan gambar */}
          {[{ src: galeri1, title: 'Gambar 1' }, { src: galeri2, title: 'Gambar 2' }, { src: galeri1, title: 'Gambar 3' }, { src: galeri2, title: 'Gambar 4' }, { src: galeri1, title: 'Gambar 5' }, { src: galeri2, title: 'Gambar 6' }, { src: galeri1, title: 'Gambar 7' }, { src: galeri2, title: 'Gambar 8' }, { src: galeri1, title: 'Gambar 9' }, { src: galeri2, title: 'Gambar 10' }, { src: galeri1, title: 'Gambar 11' }].map((image, index) => (
            <div key={index} onClick={() => handleImageClick(image.src, image.title)}>
              <img className="w-full h-auto rounded-lg cursor-pointer" src={image.src} alt={image.title} />
            </div>
          ))}
        </div>
        {/* Tampilan gambar yang diperbesar */}
        {enlargedImage && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center" onClick={handleCloseEnlargedImage}>
            <div className="max-w-full max-h-full">
              <button className="absolute top-4 right-4 text-white text-2xl" onClick={handleCloseEnlargedImage}>×</button>
              <img className="max-w-full max-h-full" src={enlargedImage} alt={enlargedImageTitle} />
              <div className="text-white absolute bottom-4 left-4">{enlargedImageTitle}</div>
            </div>
          </div>
        )}
      </Layout>
    </div>
  );
}

export default GalleryPage;
