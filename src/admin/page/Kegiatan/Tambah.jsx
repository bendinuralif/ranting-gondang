import React, { useState, useEffect } from "react";
import LayoutAdmin from "../LayoutAdmin";
import { addDoc, collection } from "firebase/firestore";
import { getFirestore, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import app from "../../../lib/firebase/init";
import { format } from 'date-fns';
import id from 'date-fns/locale/id';

function TambahKegiatan() {
  const [uploadGambar, setUploadGambar] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [judul, setJudul] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const MAIN_COLLECTION = "your_main_collection_name"; // Ganti dengan nama koleksi utama Anda

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
        setStatistics(stats);
      } catch (error) {
        console.error("Error fetching Firestore data:", error);
        // Handle error here
      }
    };

    fetchData();
  }, []);

  const handletanggalChange = (e) => {
    const inputtanggal = e.target.value;
    const regex = /^\d{4}-\d{2}-\d{2}$/; // Regex untuk format yyyy-mm-dd
  
    // Memeriksa apakah input sesuai dengan format yang diharapkan
    if (regex.test(inputtanggal)) {
      setTanggal(inputtanggal); // Memperbarui nilai tanggal jika sesuai format
    } else {
      // Menampilkan pesan kesalahan jika format tidak sesuai
      console.log("Format tanggal tidak valid. Gunakan format yyyy-mm-dd.");
    }
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Menampilkan modal loading saat proses dimulai
    const db = getFirestore(app);
    try {
      // Proses pengungahan gambar
      const storage = getStorage(app);
      const storageRef = ref(storage, 'images/' + uploadGambar.name);
      await uploadBytes(storageRef, uploadGambar);
  
      const downloadURL = await getDownloadURL(storageRef);

      // Ubah format tanggal ke "yyyy-MM-dd"
      const formattedTanggal = tanggal; // Sesuaikan dengan format tanggal yang Anda gunakan
      const docRef = await addDoc(collection(db, "Kegiatan"), {
        judul,
        tanggal: formattedTanggal,
        deskripsi,
        downloadURL
      });
  
      console.log("Document written with ID: ", docRef.id);
      setUploadGambar("");
      setJudul("");
      setTanggal("");
      setDeskripsi("");
      setPreviewImage("");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
    setIsLoading(false); // Menyembunyikan modal loading setelah proses selesai
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
        <h2 className="text-lg md:text-2xl font-semibold p-4">Upload Gambar</h2>
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
                onChange={handletanggalChange}
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

export default TambahKegiatan;
