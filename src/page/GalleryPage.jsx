import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import app from "../lib/firebase/init";

const GalleryPage = () => {
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [enlargedImageTitle, setEnlargedImageTitle] = useState('');
  const [activeButton, setActiveButton] = useState(null);
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [years, setYears] = useState([]); // Menyimpan tahun unik dari gambar

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore(app);
      const data = await getDocs(collection(db, "Galeri"));
      const imagesData = data.docs.map(doc => doc.data());
      setImages(imagesData);
      setFilteredImages(imagesData); // Set filtered images to all images initially
  
      // Mendapatkan semua tahun yang unik dari gambar
      const uniqueYears = [...new Set(imagesData.map(image => image.tahun))];
      setYears(uniqueYears);
    };
  
    fetchData();
  }, []);
  

  const handleImageClick = (imageSrc, imageTitle) => {
    setEnlargedImage(imageSrc);
    setEnlargedImageTitle(imageTitle);
  };

  const handleCloseEnlargedImage = () => {
    setEnlargedImage(null);
    setEnlargedImageTitle('');
  };

  const handleButtonClick = (buttonValue) => {
    setActiveButton(buttonValue);
    const filteredImages = buttonValue ? images.filter(image => image.tahun === buttonValue) : images;
    setFilteredImages(filteredImages);
  };

  return (
    <div>
      <Layout>
        <div className="flex items-center justify-center py-4 md:py-8 flex-wrap mt-20">
          {/* Tombol Filter */}
          <button
            className={`text-sm md:text-xl font-medium px-5 py-2.5 text-center me-3 mb-3 focus:ring-4 focus:outline-none rounded-full 
              ${activeButton === null ? 'bg-gray-700 text-white' : 'bg-white text-gray-900 border border-white hover:border-gray-200 hover:bg-red-700 hover:text-white'}
            `}
            onClick={() => handleButtonClick(null)}
          >
            Semua
          </button>
          {years.sort((a, b) => a - b).map(year => (
  <button
    key={year}
    className={`text-sm md:text-xl font-medium px-5 py-2.5 text-center me-3 mb-3 focus:ring-4 focus:outline-none rounded-full 
      ${activeButton === year ? 'bg-gray-700 text-white' : 'bg-white text-gray-900 border border-white hover:border-gray-200 hover:bg-red-700 hover:text-white'}
    `}
    onClick={() => handleButtonClick(year)}
  >
    {year}
  </button>
))}
        </div>

        {/* Galeri gambar */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10 px-10">
          {filteredImages.map((image, index) => (
            <div key={index} onClick={() => handleImageClick(image.downloadURL, image.nama)}>
              <img className="w-full h-auto rounded-lg cursor-pointer" src={image.downloadURL} alt={image.nama} />
              <div className="text-center mt-2">{image.nama} - {image.tahun}</div>
            </div>
          ))}
        </div>
        {/* Tampilan gambar yang diperbesar */}
        {enlargedImage && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center" onClick={handleCloseEnlargedImage}>
            <div className="mx-5 max-w-full max-h-full" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <button className="absolute top-4 right-4 text-white text-2xl" onClick={handleCloseEnlargedImage}>×</button>
              <img className="gallery-image w-full h-auto rounded-lg cursor-pointer" style={{ borderRadius: 10, maxWidth: '90vw' }} src={enlargedImage} alt={enlargedImageTitle} />
              <div className="text-white absolute bottom-4 left-4">{enlargedImageTitle}</div>
            </div>
          </div>
        )}
      </Layout>
    </div>
  );
}

export default GalleryPage;
