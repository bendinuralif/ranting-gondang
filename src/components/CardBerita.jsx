import React, { useEffect, useState } from 'react';

const articleUrl = "https://kilasfakta.com/psht-ranting-gondang-sukses-melaksanakan-tes-kenaikan-sabuk-putih/";

const CardBerita = () => {
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/article?url=${encodeURIComponent(articleUrl)}`);
        const data = await response.json();
        setArticle(data);
      } catch (error) {
        console.error('Error fetching article:', error);
      }
    };

    fetchArticle();
  }, [articleUrl]);

  if (!article) return <div>Loading...</div>;

  return (
    <div className="block mx-auto max-w-7xl mt-10 mb-10 sm:px-10">
      <div className="">
        <a
          href={article.link}
          className="mt-10 my-10 flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:max-w-6xl mx-5 md:mx-auto hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            className="object-cover w-full rounded-t-lg h-64 md:h-96"
            src={article.image}
            alt={article.title}
          />
          <div className="flex flex-col justify-between p-4 leading-normal">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {article.title}
            </h5>
            <p className="text-sm mb-3 font-normal text-gray-700 dark:text-gray-400 md:text-lg text-justify">
              {article.description}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{article.date}</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default CardBerita;
