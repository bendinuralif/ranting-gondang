import kegiatan1 from '../assets/img/kegiatan-1.jpg';
import kegiatan2 from '../assets/img/kegiatan-2.jpg';
import kegiatan3 from '../assets/img/kegiatan-3.jpg';

const CardKegiatan1 = () => {
  return (
    <>
      <div class="block mx-auto max-w-7xl mt-10 mb-10 sm:px-10">
          <div class="">
            
            <a
          href="#"
          className=" mt-10 my-10 flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-6xl mx-5 md:mx-auto hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-70"
        >
          <img
            className="object-cover w-full rounded-t-lg h-120 md:h-auto md:w-52 md:rounded-none md:rounded-s-lg"
            src={kegiatan1}
            alt=""
          />
          <div className="flex flex-col justify-between p-4 leading-normal">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Tes Kenaikan Sabuk Jambon Ke Hijau Tahun 2024
            </h5>
            <p className="text-sm mb-3 font-normal text-gray-700 dark:text-gray-400 md:text-lg text-justify">
              SALAM PERSAUDARAAN SH TERATE JAYA🙏
              <br />
              <br />
              Gondang, 25 Februari 2024
              <br />
              Alhamdulillah agenda tes kenaikan sabuk dari jambon ke hijau PSHT
              Ranting Gondang berjalan dengan lancar
              <br />
              <br />
              RANTING GONDANG NYAWIJI
            </p>
          </div>
        </a>
        <a
          href="#"
          className=" mt-10 my-10 flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-6xl mx-5 md:mx-auto hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-70"
        >
          <img
            className="object-cover w-full rounded-t-lg h-120 md:h-auto md:w-52 md:rounded-none md:rounded-s-lg"
            src={kegiatan2}
            alt=""
          />
          <div className="flex flex-col justify-between p-4 leading-normal">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              PSHT Cup Ranting Gondang Ke-3
            </h5>
            <p className="text-sm mb-3 font-normal text-gray-700 dark:text-gray-400 md:text-lg text-justify">
              SALAM PERSAUDARAAN SH TERATE JAYA🙏
              <br />
              <br />
              PSHT Ranting Gondnag Akan mengadakan PSHT CUP 3 yang akan di
              senggelarakan Pada Hari Minggu, 24 Desember 2023 Tempat Gedung serba guna gondang
              <br />
              Dan di ikuti oleh 9 Rayon yang ada di Ranting Gondnag Mari kita
              sukseskan dan ramaikan acara tersebut Semuga dengan mengadakan
              acara tersebut PSHT Ranting Gondnag mempunyai bibit bibit unggul
              dalam bidang prestasi dan pencak silat.
              <br />
              <br />
              RANTING GONDANG NYAWIJI
            </p>
          </div>
        </a>
        <a
          href="#"
          className=" mt-10 my-10 flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-6xl mx-5 md:mx-auto hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-70"
        >
          <img
            className="object-cover w-full rounded-t-lg h-120 md:h-auto md:w-52 md:rounded-none md:rounded-s-lg"
            src={kegiatan3}
            alt=""
          />
          <div className="flex flex-col justify-between p-4 leading-normal">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Longmarch Ranting Gondang
            </h5>
            <p className="text-sm mb-3 font-normal text-gray-700 dark:text-gray-400 md:text-lg text-justify">
              SALAM PERSAUDARAAN SH TERATE JAYA🙏
              <br />
              <br />
              Agend PSHT ranting Gondang. Acara long march, di ikuti 170 siswa se Ranting Gondang.
              <br />
              <br />
              RANTING GONDANG NYAWIJI
            </p>
          </div>
        </a>
          </div>
        </div>
    </>
  );
};

export default CardKegiatan1;