import React, { useState, useEffect } from "react";
import LayoutAdmin from "../LayoutAdmin";
import { addDoc, collection, getFirestore, deleteDoc, updateDoc, getDocs, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import app from "../../../lib/firebase/init";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

function DetailGaleri() {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedData, setPaginatedData] = useState([]);
  const [selectedItemToDelete, setSelectedItemToDelete] = useState(null);
  const [selectedItem, setSelectedItem] = useState({
    gambar: "",
    nama: "",
    tahun: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedItem, setEditedItem] = useState({});
  const [sortOrder, setSortOrder] = useState("asc"); // Add sort order state

  const [statistics, setStatistics] = useState([]);
  const [session, setSession] = useState(null); // Menyimpan informasi sesi

  useEffect(() => {
      // Logika untuk memeriksa sesi pengguna
      const checkSession = () => {
          const userSession = sessionStorage.getItem("user"); // Misalnya, Anda menyimpan sesi pengguna dalam sessionStorage
          if (userSession) {
              setSession(userSession); // Set sesi jika ada
          } else {
              // Redirect ke halaman login jika tidak ada sesi
              window.location.href = "/login"; // Ubah "/login" sesuai dengan rute login Anda
          }
      };

      checkSession(); // Panggil fungsi untuk memeriksa sesi saat komponen dimuat

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

  useEffect(() => {
    fetchData();
  }, [sortOrder]);

  useEffect(() => {
    const totalPagesCount = Math.ceil(data.length / rowsPerPage);
    setTotalPages(totalPagesCount);
  }, [data, rowsPerPage]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    setPaginatedData(data.slice(startIndex, endIndex));
  }, [data, currentPage, rowsPerPage]);

  const fetchData = async () => {
    const db = getFirestore(app);
    try {
      const querySnapshot = await getDocs(collection(db, "Galeri"));
      const res = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort the data based on tahun
      res.sort((a, b) => {
        const yearA = parseInt(a.tahun, 10);
        const yearB = parseInt(b.tahun, 10);
        if (sortOrder === "asc") {
          return yearA - yearB;
        } else {
          return yearB - yearA;
        }
      });
      setData(res);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  const handleUploadGambar = async () => {
    try {
      if (file) {
        const storage = getStorage(app);
        const storageRef = ref(storage, `images/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        setUploadMessage("Upload berhasil!");
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 3000);
        return downloadURL;
      } else {
        console.error("Please select a file to upload.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setErrorMessage("Upload gagal.");
      setShowErrorModal(true);
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleChangeRowsPerPage = (e) => {
    const value = e.target.value;
    if (value === "All") {
      setRowsPerPage(data.length);
      setCurrentPage(1);
    } else {
      setRowsPerPage(parseInt(value, 10));
      setCurrentPage(1);
    }
  };

  const handleEdit = (item) => {
    setEditedItem(item);
    setShowEditModal(true);
  };

  const handleDelete = (item) => {
    setSelectedItemToDelete(item);
    setDeleteConfirmationModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const db = getFirestore(app);
      await deleteDoc(doc(db, "Galeri", selectedItemToDelete.id));
      console.log("Item deleted successfully!");
      fetchData();
      setSelectedItemToDelete(null);
      setDeleteConfirmationModalOpen(false);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleCancelDelete = () => {
    setSelectedItemToDelete(null);
    setDeleteConfirmationModalOpen(false);
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const db = getFirestore(app);
      const itemId = editedItem.id;
      const itemRef = doc(db, "Galeri", itemId);
      await updateDoc(itemRef, editedItem);
      console.log("Item updated successfully!");
      setShowEditModal(false);
      fetchData();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const handleSortToggle = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  return (
    <LayoutAdmin>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-lg md:text-2xl font-semibold mb-4">Detail Ketua Tanting</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="p-4"></th>
                <th scope="col" className="px-2 py-3">
                  Gambar
                </th>
                <th scope="col" className="px-2 py-3">
                  Nama
                </th>
                <th scope="col" className="px-2 py-3">
                  Tahun
                </th>
                <th scope="col" className="px-2 py-3">
                Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-4 py-2"></td>
                  <td className="px-2 py-2">
                    <img
                      src={item.downloadURL}
                      alt={item.nama}
                      className="h-10 w-10 rounded-full cursor-pointer"
                      onClick={() => handleImageClick(item.downloadURL)}
                    />
                  </td>
                  <td className="px-2 py-2">{item.nama}</td>
                  <td className="px-2 py-2">{item.tahun}</td>
                  <td className="px-2 py-2">
                  <button
  onClick={() => handleEdit(item)}
  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
>
  <FontAwesomeIcon icon={faEdit} /> {/* Ganti teks "Edit" dengan ikon edit */}
</button>
                  
                 
                  <button
  onClick={() => handleDelete(item)}
  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
>
  <FontAwesomeIcon icon={faTrashAlt} /> {/* Ganti teks "Hapus" dengan ikon hapus */}
</button>
</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
            <div>
              <span className="mr-2">Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
                className="px-2 py-1 border border-gray-300 rounded-md"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="All">All</option>
              </select>
            </div>
            <div>
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-2 py-1 mr-2 border border-gray-300 rounded-md"
              >
                Prev
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-2 py-1 border border-gray-300 rounded-md"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      {showEditModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div
              className="inline-block align-middle bg-white dark:bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog" aria-modal="true" aria-labelledby="modal-headline"
            >
              <div className="bg-white dark:bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <form onSubmit={handleSubmitEdit}>
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100" id="modal-headline">
                        Edit Item
                      </h3>
                      <div className="mt-2">
                        <label htmlFor="editNama" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Nama
                        </label>
                        <input
                          type="text"
                          id="editNama"
                          name="editNama"
                          value={editedItem.nama}
                          onChange={(e) => setEditedItem({ ...editedItem, nama: e.target.value })}
                          required
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-gray-800 dark:text-white"
                        />
                      </div>
                      <div className="mt-2">
                        <label htmlFor="editTahun" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Tahun
                        </label>
                        <input
                          type="text"
                          id="editTahun"
                          name="editTahun"
                          value={editedItem.tahun}
                          onChange={(e) => setEditedItem({ ...editedItem, tahun: e.target.value })}
                          required
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-gray-800 dark:text-white"
                        />
                      </div>
                      <div className="mt-2">
                        <label htmlFor="editGambar" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Gambar Baru
                        </label>
                        <input
                          type="file"
                          id="editGambar"
                          name="editGambar"
                          onChange={(e) => setEditedItem({ ...editedItem, newImage: e.target.files[0] })}
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-gray-800 dark:text-white"
                        />
                      </div>
                      <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Gambar Saat Ini
                        </label>
                        <img
                          src={editedItem.downloadURL}
                          alt={editedItem.nama}
                          className="h-20 w-20 mt-1 rounded-full cursor-pointer"
                          onClick={() => handleImageClick(editedItem.downloadURL)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={() => setShowEditModal(false)}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white dark:bg-gray-900 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {showImageModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-middle bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <img src={selectedImage} alt="Selected Image" className="max-w-full h-auto mx-auto" />
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => setShowImageModal(false)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedItemToDelete && (
  <div className="fixed z-10 inset-0 overflow-y-auto">
    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div className="fixed inset-0 transition-opacity" aria-hidden="true">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Konfirmasi Hapus</h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">Apakah Anda yakin ingin menghapus "<span className="font-semibold text-[1rem]">{selectedItemToDelete.nama}</span>"?</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            onClick={() => {
              confirmDelete(selectedItemToDelete);
              setSelectedItemToDelete(null);
            }}
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Ya
          </button>
          <button
            onClick={() => setSelectedItemToDelete(null)}
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Tidak
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </LayoutAdmin>
  );
}

export default DetailGaleri;