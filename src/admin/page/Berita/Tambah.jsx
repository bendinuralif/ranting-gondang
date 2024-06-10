import React, { useState, useEffect } from "react";
import LayoutAdmin from "../LayoutAdmin";
import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import app from "../../../lib/firebase/init";

function TambahBerita() {
  const [uploadGambar, setUploadGambar] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [judul, setJudul] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [link, setLink] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const MAIN_COLLECTION = "your_main_collection_name"; // Replace with your main collection name

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore(app);
      try {
        const mainCollectionRef = collection(db, MAIN_COLLECTION);
        const snapshot = await getDocs(mainCollectionRef);

        const promises = snapshot.docs.map(async (doc) => {
          const subCollectionRef = collection(db, doc.id);
          const subSnapshot = await getDocs(subCollectionRef);
          return { collection: doc.id, count: subSnapshot.size };
        });

        const stats = await Promise.all(promises);
        // Handle stats if necessary
      } catch (error) {
        console.error("Error fetching Firestore data:", error);
      }
    };

    fetchData();
  }, []);

  const handleTanggalChange = (e) => {
    const inputTanggal = e.target.value;
    const regex = /^\d{4}-\d{2}-\d{2}$/; // Regex for yyyy-mm-dd format

    if (regex.test(inputTanggal)) {
      setTanggal(inputTanggal);
    } else {
      console.log("Invalid date format. Use yyyy-mm-dd.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const db = getFirestore(app);
    try {
      // Image upload process
      const storage = getStorage(app);
      const storageRef = ref(storage, 'images/' + uploadGambar.name);
      await uploadBytes(storageRef, uploadGambar);

      const downloadURL = await getDownloadURL(storageRef);

      // Add document to Firestore
      await addDoc(collection(db, "Berita"), {
        judul,
        tanggal,
        deskripsi,
        link,
        downloadURL
      });

      // Reset form
      setUploadGambar(null);
      setJudul("");
      setTanggal("");
      setDeskripsi("");
      setLink("");
      setPreviewImage("");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
    setIsLoading(false);
  };

  const handleUploadGambarChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setUploadGambar(selectedFile);
      setPreviewImage(URL.createObjectURL(selectedFile));
    }
  };

  return (
    <LayoutAdmin>
      <div>
        <h2 className="text-lg md:text-2xl font-semibold p-4">Tambah Berita</h2>
      </div>
      <div className="flex justify-center items-center p-5 ">
        <form className="max-w-3xl mx-auto bg-gray-200 shadow-md rounded-lg p-8" onSubmit={handleSubmit}>
          <div className="grid gap-6 mb-6 md:grid-cols-1">
            <div>
              <label
                htmlFor="uploadGambar"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Upload Gambar
              </label>
              <input
                type="file"
                id="uploadGambar"
                onChange={handleUploadGambarChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </div>
            {previewImage && (
              <div className="mt-2">
                <img src={previewImage} alt="Preview" className="w-full h-auto max-h-60 object-cover rounded-lg" />
              </div>
            )}
          </div>
          
          <div className="grid gap-6 mb-6 md:grid-cols-1">
            <div>
              <label
                htmlFor="link"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Link
              </label>
              <input
                type="text"
                id="link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Masukkan link"
                required
              />
            </div>
            <div>
              <label
                htmlFor="judul"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Judul
              </label>
              <input
                type="text"
                id="judul"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Masukkan judul"
                required
              />
            </div>
          </div>
          <div className="grid gap-6 mb-6 md:grid-cols-1">
            <div>
              <label
                htmlFor="deskripsi"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Deskripsi
              </label>
              <input
                type="text"
                id="deskripsi"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Masukkan deskripsi"
                required
              />
            </div>
          </div>
          <div className="grid gap-6 mb-6 md:grid-cols-1">
            <div>
              <label
                htmlFor="tanggal"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Tanggal
              </label>
              <input
                type="date"
                id="tanggal"
                value={tanggal}
                onChange={handleTanggalChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Masukkan tanggal"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
        </form>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Upload berhasil!</h2>
            <button
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm ml-1 px-10 py-2.5 "
              onClick={() => setShowSuccessModal(false)}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      )}
    </LayoutAdmin>
  );
}

export default TambahBerita;
