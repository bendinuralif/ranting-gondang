import React from 'react';
import Layout from './Layout';
import galeri1 from '../assets/img/galeri-1.jpg';
import galeri2 from '../assets/img/galeri-2.jpg';

const GalleryPage = () => {
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
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10 px-10">
          <div>
              <img className="w-full h-auto rounded-lg" src={galeri1} alt="" />
          </div>
          <div>
              <img className="w-full h-auto rounded-lg" src={galeri2} alt="" />
          </div>
          <div>
              <img className="w-full h-auto rounded-lg" src={galeri1} alt="" />
          </div>
          <div>
              <img className="w-full h-auto rounded-lg" src={galeri2} alt="" />
          </div>
          <div>
              <img className="w-full h-auto rounded-lg" src={galeri1} alt="" />
          </div>
          <div>
              <img className="w-full h-auto rounded-lg" src={galeri2} alt="" />
          </div>
          <div>
              <img className="w-full h-auto rounded-lg" src={galeri1} alt="" />
          </div>
          <div>
              <img className="w-full h-auto rounded-lg" src={galeri2} alt="" />
          </div>
          <div>
              <img className="w-full h-auto rounded-lg" src={galeri1} alt="" />
          </div>
          <div>
              <img className="w-full h-auto rounded-lg" src={galeri2} alt="" />
          </div>
          <div>
              <img className="w-full h-auto rounded-lg" src={galeri1} alt="" />
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default GalleryPage;
