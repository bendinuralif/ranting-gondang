
import React, { useState } from 'react';
import Layout from '../page/Layout';
import galeri1 from '../assets/img/galeri-1.jpg';
import galeri2 from '../assets/img/galeri-2.jpg';

const Gallery2021 = () => {
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
        {/* Galeri gambar */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10 px-10">
          {/* Looping untuk menampilkan gambar */}
          {[{ src: galeri1, title: 'Gambar 1' }].map((image, index) => (
            <div key={index} onClick={() => handleImageClick(image.src, image.title)}>
              <img className="w-full h-auto rounded-lg cursor-pointer" src={image.src} alt={image.title} />
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
    </div>
  );
}

export default Gallery2021;