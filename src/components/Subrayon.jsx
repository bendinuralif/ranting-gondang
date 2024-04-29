import React from 'react';
import Layout from '../page/Layout';
import { retrieveData } from "../lib/firebase/service";
import { useEffect, useState } from "react";

function SubRayon() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await retrieveData('SubRayon');
        setData(res);
        console.log(res); // Cetak data yang diterima dari Firebase
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Panggil fungsi fetchData saat komponen dimount
  }, []); // [] artinya useEffect hanya dipanggil sekali saat komponen dimount

  return (
    <Layout>
      <div className="pt-20">
        <div className="text-lg md:text-2xl font-semibold pt-10 text-center">
          SUB RAYON RANTING GONDANG
        </div>
        <div className="text-lg md:text-2xl font-semibold  pb-5 text-center">
          CABANG SRAGEN
        </div>
      </div>
      <div className="justify-center items-center px-5">
        <div
          href="#"
          className="px-2 block mx-auto max-w-7xl mt-10 mb-10 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
        >
          <div className="relative overflow-x-auto mt-4">
            <table className="w-full text-xs md:text-sm text-left rtl:text-right text-gray-700 dark:text-gray-600">
              <thead className="text-xs md:text-sm text-black uppercase bg-gray-50 dark:bg-gray-700 dark:text-red-00">
                <tr>
                  <th scope="col" className="px-2 py-2">
                    No
                  </th>
                  <th scope="col" className="px-2 py-2">
                    Sub
                  </th>
                  <th scope="col" className="px-2 py-2">
                    Rayon
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td className="px-2 py-2">{index + 1}</td>
                    <td className="px-2 py-2">{item.sub}</td>
                    <td className="px-2 py-2">{item.rayon}</td>
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

export default SubRayon;
