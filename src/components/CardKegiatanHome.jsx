import { useState, useEffect } from "react";
import { retrieveData } from "../lib/firebase/service";
import { format } from "date-fns";

const CardKegiatanHome = () => {
  const [kegiatanData, setKegiatanData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await retrieveData("Kegiatan");

        // Sort data by date in descending order
        const sortedData = data.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

        // Limit the data to the 3 most recent items
        const limitedData = sortedData.slice(0, 3);

        setKegiatanData(limitedData);
      } catch (error) {
        console.error("Error fetching kegiatan data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="block mx-auto max-w-7xl mt-10 mb-10 sm:px-10">
      {kegiatanData.map((kegiatan) => (
        <div
          key={kegiatan.id}
          className="mt-10 my-10 flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-6xl mx-5 md:mx-auto hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-70"
        >
          <img
            className="object-cover w-full rounded-t-lg h-120 md:w-1/3  md:rounded-none md:rounded-s-lg"
            src={kegiatan.downloadURL}
            alt=""
          />
          <div className="flex flex-col justify-between p-4 leading-normal">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {kegiatan.judul}
            </h5>
            <p className="text-sm mb-3 font-normal text-gray-700 dark:text-gray-400 md:text-lg text-justify">
              SALAM PERSAUDARAAN SH TERATE JAYA🙏
              <br />
              <br />
              <td>{format(new Date(kegiatan.tanggal), "dd-MMM-yyyy")}</td>
              <br />
              {kegiatan.deskripsi}
              <br />
              <br />
              RANTING GONDANG NYAWIJI
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardKegiatanHome;
