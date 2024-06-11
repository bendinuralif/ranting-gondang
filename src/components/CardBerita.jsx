import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import app from "../lib/firebase/init";

const CardBerita = () => {
  const [newsArticles, setNewsArticles] = useState([]);

  useEffect(() => {
    const fetchNewsArticles = async () => {
      const db = getFirestore(app);
      try {
        const querySnapshot = await getDocs(collection(db, "Berita"));
        const articles = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        // Sort articles by date
        articles.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
        setNewsArticles(articles);
      } catch (error) {
        console.error("Error fetching news articles: ", error);
      }
    };

    fetchNewsArticles();
  }, []);

  return (
    <div className="container mx-auto mt-10 mb-10 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {newsArticles.map((article, index) => (
          <a
            href={article.link}
            key={index}
            className="group block bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="relative">
              <img
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                src={article.downloadURL}
                alt={article.judul}
              />
              <div className="absolute inset-0 bg-black opacity-25 group-hover:opacity-50 transition-opacity duration-300 ease-in-out"></div>
            </div>
            <div className="p-4">
              <h5 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-red-600 transition-colors duration-300 ease-in-out">
                {article.judul}
              </h5>
              <p className="text-sm text-gray-700 text-justify dark:text-gray-400 mb-4">
                {article.deskripsi}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {article.tanggal}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default CardBerita;
