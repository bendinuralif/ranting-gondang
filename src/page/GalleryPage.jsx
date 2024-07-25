import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { getFirestore, collection, getDocs, query, orderBy, startAfter, limit } from 'firebase/firestore';
import app from "../lib/firebase/init";
import LazyLoad from 'react-lazyload';

const GalleryPage = () => {
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [enlargedImageTitle, setEnlargedImageTitle] = useState('');
  const [activeButton, setActiveButton] = useState(null);
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [years, setYears] = useState([]); // Menyimpan tahun unik dari gambar
  const [lastDoc, setLastDoc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      const db = getFirestore(app);
      const initialQuery = query(collection(db, "Galeri"), orderBy('tahun'), limit(20));
      const data = await getDocs(initialQuery);
      const imagesData = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setImages(imagesData);
      setFilteredImages(imagesData);
      setLastDoc(data.docs[data.docs.length - 1]);

      // Mendapatkan semua tahun yang unik dari gambar
      const uniqueYears = [...new Set(imagesData.map(image => image.tahun))];
      setYears(uniqueYears);
      setIsLoading(false);
    };

    fetchInitialData();
  }, []);

  const fetchMoreData = async () => {
    setIsLoading(true);
    const db = getFirestore(app);
    const nextQuery = query(collection(db, "Galeri"), orderBy('tahun'), startAfter(lastDoc), limit(20));
    const data = await getDocs(nextQuery);
    const newImages = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setImages(prevImages => [...prevImages, ...newImages]);
    setFilteredImages(prevImages => [...prevImages, ...newImages]);
    setLastDoc(data.docs[data.docs.length - 1]);

    // Update years if there are new images
    const newYears = [...new Set(newImages.map(image => image.tahun))];
    setYears(prevYears => [...new Set([...prevYears, ...newYears])]);
    setIsLoading(false);
  };

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
            className={`text-sm md:text-xl font-medium px-6 py-3 text-center me-3 mb-3 focus:ring-4 focus:outline-none rounded-full transition-transform transform hover:scale-105
              ${activeButton === null ? 'bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white shadow-lg' : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-100'}
            `}
            onClick={() => handleButtonClick(null)}
          >
            Semua
          </button>
          {years.sort((a, b) => a - b).map(year => (
            <button
              key={year}
              className={`text-sm md:text-xl font-medium px-6 py-3 text-center me-3 mb-3 focus:ring-4 focus:outline-none rounded-full transition-transform transform hover:scale-105
                ${activeButton === year ? 'bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white shadow-lg' : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-100'}
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
            <LazyLoad key={index} height={200} offset={100} once>
              <div onClick={() => handleImageClick(image.downloadURL, image.nama)}>
                <img className="w-full h-auto rounded-lg cursor-pointer" src={image.downloadURL} alt={image.nama} />
                <div className="text-center mt-2">{image.nama} - {image.tahun}</div>
              </div>
            </LazyLoad>
          ))}
        </div>
        
        {/* Tombol Load More */}
        {lastDoc && (
          <div className="flex justify-center my-10">
            <button
              className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white text-sm md:text-xl font-medium px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform"
              onClick={fetchMoreData}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}

        {/* Tampilan gambar yang diperbesar */}
        {enlargedImage && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center p-4 md:p-8" onClick={handleCloseEnlargedImage}>
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <button className="absolute top-4 right-4 text-white text-2xl" onClick={handleCloseEnlargedImage}>×</button>
              <img className="gallery-image w-auto h-auto max-h-full max-w-full rounded-lg cursor-pointer" style={{ borderRadius: 10 }} src={enlargedImage} alt={enlargedImageTitle} />
              {/* <div className="absolute bottom-4 right-4">
                <a href={enlargedImage} download className="text-white text-2xl bg-gray-800 p-2 rounded-full">⬇️</a>
              </div> */}
              <div className="text-white absolute bottom-4 left-4">{enlargedImageTitle}</div>
            </div>
          </div>
        )}
      </Layout>
    </div>
  );
}

export default GalleryPage;
