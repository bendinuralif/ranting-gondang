import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { retrieveData } from "../lib/firebase/service";

function StrukturOrganisasi() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await retrieveData('StrukturOrganisasi');
        res.sort((a, b) => a.no - b.no);
        setData(res);
        console.log(res); // Print data received from Firebase
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call fetchData function when the component is mounted
  }, []); // [] means useEffect is called only once when the component is mounted

  return (
    <Layout>
      <div className="pt-20 text-center">
        <h2 className="text-2xl md:text-4xl font-bold pt-10 text-gray-800 dark:text-gray-200">
          STRUKTUR ORGANISASI RANTING GONDANG
        </h2>
        <h3 className="text-xl md:text-3xl font-medium pb-5 text-gray-600 dark:text-gray-400">
          CABANG SRAGEN
        </h3>
      </div>
      <div className="flex justify-center items-center px-5">
        <div className="w-full max-w-7xl mt-10 mb-10 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <div className="relative overflow-x-auto mt-4">
            <table className="w-full text-sm text-left text-gray-700 dark:text-gray-400">
              <thead className="text-xs uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-4 py-3">No</th>
                  <th scope="col" className="px-4 py-3">Nama</th>
                  <th scope="col" className="px-4 py-3">Jabatan</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} border-b dark:bg-gray-800 dark:border-gray-700`}>
                    <td className="px-4 py-3">{item.no}</td>
                    <td className="px-4 py-3">{item.nama}</td>
                    <td className="px-4 py-3">{item.jabatan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default StrukturOrganisasi;
