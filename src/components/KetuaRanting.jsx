import React, { useEffect, useState } from 'react';
import Layout from '../page/Layout';
import { retrieveData } from "../lib/firebase/service";

function KetuaRanting() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await retrieveData('KetuaRanting');
        const sortedData = res.sort((a, b) => {
          if (typeof a.no === "string" && typeof b.no === "string") {
            return a.no.localeCompare(b.no);
          } else {
            return a.no - b.no;
          }
        });
        setData(sortedData);
        console.log(sortedData); // Print data received from Firebase after sorting
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call fetchData function when the component is mounted
  }, []); // [] means useEffect is called only once when the component is mounted

  return (
    <Layout>
      <div className="pt-20 text-center">
        <h2 className="text-2xl md:text-4xl font-bold pt-10 text-gray-800">
          DAFTAR KETUA PSHT RANTING GONDANG
        </h2>
        <h3 className="text-xl md:text-3xl font-medium pb-5 text-gray-600">
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
                  <th scope="col" className="px-4 py-3">Tahun</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className={`bg-${index % 2 === 0 ? 'gray-100' : 'white'} border-b dark:bg-gray-800 dark:border-gray-700`}>
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{item.nama}</td>
                    <td className="px-4 py-3">{item.tahun}</td>
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

export default KetuaRanting;
