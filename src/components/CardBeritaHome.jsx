import React from 'react';

const newsArticles = [
  {
    title: "PSHT Ranting Gondang Sukses Melaksanakan Tes Kenaikan Sabuk Putih",
    description: "SRAGEN – Kilasfakta.com. Pada hari minggu 27 Maret 2022, PSHT Ranting Gondang Cabang Sragen sukses Melaksanakan Tes Kenaikan Sabuk Putih. Hadir dalam acara, Ketua Ranting PSHT Gondang Sumarno, Warga PSHT se Ranting Gondang,Kapolsek Gondang AKP Sudarmaji S.H.",
    date: "28 Maret 2022",
    image: "https://kilasfakta.com/wp-content/uploads/2022/03/IMG-20220328-WA0055.jpg",
    link: "https://kilasfakta.com/psht-ranting-gondang-sukses-melaksanakan-tes-kenaikan-sabuk-putih/",
  },
  {
    title: "PSHT Ranting Gondang Sukses Laksanakan Tes Kenaikan Sabuk Hijau",
    description: "SRAGEN – Kilasfakta.com. Hari minggu 13 februari 2022 Siswa PSHT Ranting Gondang Cabang Sragen, Sukses Melaksanakan Tes Kenaikan Sabuk Hijau. Hadir dalam acara, Ketua Ranting PSHT Gondang Sumarno, Warga PSHT se Ranting Gondang,Kapolsek Gondang AKP Sudarmaji S.H.",
    date: "13 Februari 2022 ",
    image: "https://kilasfakta.com/wp-content/uploads/2022/02/IMG-20220213-WA0037.jpg",
    link: "https://kilasfakta.com/11336-2/",
  },
  {
    title: "1.000 Lebih Pendekar PSHT Gondang Berkumpul Untuk Maaf-Maafan. Rindukan PSHT Sragen Bisa Bersatu Lagi!  ",
    description: "SRAGEN- Lebih dari 1.000 warga perguruan silat persaudaraan setia hati terate (PSHT) ranting Gondang berkumpul untuk mengikuti halal bihalal di padepokan PSHT Gondang, Jumat (29/6/2018) malam. Selain saling memaafkan, momentum halal bihalal itu diharapkan bisa menjadi wahana pemersatu kembali PSHT di Sragen yang kini dilanda dualisme.",
    date: "30 Juni 2018",
    image: "https://i0.wp.com/joglosemarnews.com/images/2018/06/IMG-20180630-WA0001-520x390.jpg?resize=520%2C390&ssl=1",
    link: "https://joglosemarnews.com/2018/06/1-000-lebih-pendekar-psht-gondang-berkumpul-untuk-maaf-maafan-rindukan-psht-sragen-bisa-bersatu-lagi/",
  },
  // Tambahkan lebih banyak BeritaHome sesuai kebutuhan
];

const CardBeritaHome = () => {
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

export default CardBeritaHome;
