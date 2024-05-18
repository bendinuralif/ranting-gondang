import React, { useState } from "react";
import LayoutAdmin from "./LayoutAdmin";
import { addDoc, collection } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import app from "./../../lib/firebase/init";

const collections = ["Siswa", "Warga", "Rayon", "SubRayon", "StrukturOrganisasi"];

function UploadData() {
  const [selectedCollection, setSelectedCollection] = useState("");
  const [file, setFile] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCollection || !file) {
      console.error("Please select a collection and choose a file to upload.");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const jsonData = e.target.result;
        const data = JSON.parse(jsonData);
        const db = getFirestore(app);
        const collectionRef = collection(db, selectedCollection);

        // Upload each document in the data array
        for (const item of data) {
          await addDoc(collectionRef, item);
        }

        console.log("Data uploaded successfully!");
        setShowSuccessModal(true);
      };

      reader.readAsText(file);
    } catch (error) {
      console.error("Error uploading file:", error);
      setErrorMessage("Upload failed.");
      setShowErrorModal(true);
    }
  };

  return (
    <LayoutAdmin>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-lg md:text-2xl font-semibold mb-4">Upload Data</h2>
        <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="collection" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Pilih Koleksi:
            </label>
            <select
              id="collection"
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            >
              <option value="">Pilih koleksi</option>
              {collections.map((collection) => (
                <option key={collection} value={collection}>{collection}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="file" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Pilih File JSON:
            </label>
            <input
              type="file"
              id="file"
              accept=".json"
              onChange={handleFileChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Unggah Data
          </button>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg">
            <p className="text-xl font-semibold">Upload berhasil!</p>
            <button
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-10 py-2.5 mt-4 ml-5"
              onClick={() => setShowSuccessModal(false)}
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-sm w-full">
<div className="p-6">
<p className="text-lg font-semibold mb-4">Upload gagal!</p>
<p className="text-sm text-gray-700">{errorMessage}</p>
</div>
<div className="bg-gray-100 p-4 flex justify-center">
<button
className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-10 py-2.5"
onClick={() => setShowErrorModal(false)}
>
Tutup
</button>
</div>
</div>
</div>
)}
</LayoutAdmin>
);
}

export default UploadData;
