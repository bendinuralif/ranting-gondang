import React, { useState, useEffect } from 'react';
import Layout from '../page/Layout';
import { retrieveData, uploadData } from "../lib/firebase/service";
import { collection, addDoc, getFirestore } from "firebase/firestore";
import app from '../lib/firebase/init';

const firestore = getFirestore(app);

function SubRayon() {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await retrieveData('SubRayon');
      const sortedData = res.sort((a, b) => a.rayon.localeCompare(b.rayon));
    setData(sortedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  const handleUpload = async () => {
    try {
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const json = JSON.parse(e.target.result);
          for (const item of json) {
            await addDoc(collection(firestore, 'SubRayon'), item);
          }
          console.log('Data uploaded successfully!');
          fetchData(); // Fetch data again after upload
          setUploadMessage('Upload berhasil!');
          setTimeout(() => {
            setUploadMessage('');
          }, 3000); // Remove message after 3 seconds
        };
        reader.readAsText(file);
      } else {
        console.error('Please select a file to upload.');
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadMessage('Upload gagal.');
    }
  };

  return (
    <Layout>
      <div className="pt-20">
        <div className="text-lg md:text-2xl font-semibold pt-10 text-center">
          SUB RAYON RANTING GONDANG
        </div>
        <div className="text-lg md:text-2xl font-semibold pb-5 text-center">
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
              <thead className="text-xs md:text-sm text-black uppercase bg-gray-300 dark:bg-gray-700 dark:text-red-00">
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
                  <tr key={index} className={`bg-${index % 2 === 0 ? 'gray-100' : 'white'} border-b dark:bg-gray-800 dark:border-gray-700`}>
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
      {/* <div className="flex justify-center items-center mt-5">
        <input type="file" accept=".json" onChange={handleFileChange} />
        <button className="ml-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleUpload}>
          Upload JSON
        </button>
        {uploadMessage && <p className="ml-3 text-green-500">{uploadMessage}</p>}
      </div> */}
    </Layout>
  );
}

export default SubRayon;
