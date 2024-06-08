import React, { useState, useEffect } from 'react';
import Layout from '../page/Layout';
import { retrieveData } from "../lib/firebase/service";
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
      <div className="pt-20 text-center">
        <h2 className="text-2xl md:text-4xl font-bold pt-10 text-gray-800">
          SUB RAYON RANTING GONDANG
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
                  <th scope="col" className="px-4 py-3">Sub</th>
                  <th scope="col" className="px-4 py-3">Rayon</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className={`bg-${index % 2 === 0 ? 'gray-100' : 'white'} border-b dark:bg-gray-800 dark:border-gray-700`}>
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{item.sub}</td>
                    <td className="px-4 py-3">{item.rayon}</td>
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
