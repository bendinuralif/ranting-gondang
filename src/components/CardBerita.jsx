import React from 'react';

const newsArticles = [
  {
    title: "Berita Pertama",
    description: "Pada hari minggu 27 Maret 2022, PSHT Ranting Gondang Cabang Sragen sukses Melaksanakan Tes Kenaikan Sabuk Putih. Hadir dalam acara, Ketua Ranting PSHT Gondang Sumarno, Warga PSHT se Ranting Gondang,Kapolsek Gondang AKP Sudarmaji S.H.",
    date: "20 Maret 2022",
    image: "https://kilasfakta.com/wp-content/uploads/2022/03/IMG-20220328-WA0055.jpg",
    link: "https://kilasfakta.com/psht-ranting-gondang-sukses-melaksanakan-tes-kenaikan-sabuk-putih/",
  },
  {
    title: "Berita Kedua",
    description: "Deskripsi singkat untuk berita kedua.",
    date: "19 Mei 2024",
    image: "https://example.com/path/to/berita-2.jpg",
    link: "https://example.com/berita-kedua",
  },
  {
    title: "Berita Ketiga",
    description: "Deskripsi singkat untuk berita ketiga.",
    date: "18 Mei 2024",
    image: "https://example.com/path/to/berita-3.jpg",
    link: "https://example.com/berita-ketiga",
  },
  // Tambahkan lebih banyak berita sesuai kebutuhan
];

const CardBerita = () => {
  return (
    <div className="block mx-auto max-w-7xl mt-10 mb-10 sm:px-10">
      <div className="">
        {newsArticles.map((article, index) => (
          <a
            href={article.link}
            key={index}
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
        ))}
      </div>
    </div>
  );
};

export default CardBerita;
