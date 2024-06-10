import React, { useState, useEffect } from "react";
import LayoutAdmin from "../LayoutAdmin";
import { addDoc, collection, getFirestore, deleteDoc, updateDoc, getDocs, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import app from "../../../lib/firebase/init";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { format } from "date-fns";

function DetailKegiatan() {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedData, setPaginatedData] = useState([]);
  const [selectedItemToDelete, setSelectedItemToDelete] = useState(null);
  const [selectedItem, setSelectedItem] = useState({
    gambar: "",
    judul: "",
    deskripsi: "",
    tanggal: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editedItem, setEditedItem] = useState({});
  const [newItem, setNewItem] = useState({
    gambar: "",
    judul: "",
    deskripsi: "",
    tanggal: "",
  });
  const [sortOrder, setSortOrder] = useState("asc");
  const [session, setSession] = useState(null);

  useEffect(() => {
    const checkSession = () => {
      const userSession = sessionStorage.getItem("user");
      if (userSession) {
        setSession(userSession);
      } else {
        window.location.href = "/login";
      }
    };

    checkSession();

    const fetchData = async () => {
      const db = getFirestore(app);
      try {
        const mainCollectionRef = collection(db, "Kegiatan");
        const snapshot = await getDocs(mainCollectionRef);
        const res = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.sort((a, b) => {
          const dateA = new Date(a.tanggal);
          const dateB = new Date(b.tanggal);
          if (sortOrder === "asc") {
            return dateA - dateB;
          } else {
            return dateB - dateA;
          }
        });
        setData(res);
      } catch (error) {
        console.error("Error fetching Firestore data:", error);
      }
    };

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

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    setFilePreview(URL.createObjectURL(uploadedFile));
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
      await deleteDoc(doc(db, "Kegiatan", selectedItemToDelete.id));
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
      const itemRef = doc(db, "Kegiatan", itemId);
      await updateDoc(itemRef, editedItem);
      console.log("Item updated successfully!");
      setShowEditModal(false);
      fetchData();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    try {
      const downloadURL = await handleUploadGambar();
      if (downloadURL) {
        const db = getFirestore(app);
        const newActivity = { ...newItem, downloadURL };
        await addDoc(collection(db, "Kegiatan"), newActivity);
        console.log("Item added successfully!");
        setShowAddModal(false);
        fetchData();
        setNewItem({ gambar: "", judul: "", deskripsi: "", tanggal: "" });
        setFile(null);
        setFilePreview(null);
      }
    } catch (error) {
      console.error("Error adding item:", error);
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
        <h2 className="text-lg md:text-2xl font-semibold mb-4">Detail Kegiatan</h2>
        <div className="overflow-x-auto">
          <div className="flex justify-end items-center px-3 pb-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
            >
              Tambah Kegiatan
            </button>
          </div>
          <table className="w-full text-xs md:text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="p-4"></th>
                <th scope="col" className="px-2 py-3">Gambar</th>
                <th scope="col" className="px-2 py-3">Judul</th>
                <th scope="col" className="px-2 py-3">Deskripsi</th>
                <th scope="col" className="px-2 py-3">Tanggal</th>
                <th scope="col" className="px-2 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-4 py-2"></td>
                  <td className="px-2 py-2">
                  <div
  className="h-20 w-30 cursor-pointer overflow-hidden flex items-center justify-center"
  onClick={() => handleImageClick(item.downloadURL)}
>
  <img
    src={item.downloadURL}
    alt={item.judul}
    className="h-full w-full object-cover"
  />
</div>


                  </td>
                  <td className="px-2 py-2">{item.judul}</td>
                  <td className="px-2 py-2">{item.deskripsi}</td>
                  <td className="px-2 py-2">{format(new Date(item.tanggal), "dd-MMM-yyyy")}</td>
                  <td className="px-2 py-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center px-3 pb-3">
            <div>
              <label htmlFor="rowsPerPage" className="mr-2">Baris per halaman:</label>
              <select
                id="rowsPerPage"
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
                className="border rounded px-3 py-1"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value={data.length}>All</option>
              </select>
            </div>
            <div className="flex items-center">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Prev
              </button>
              <span>Halaman {currentPage} dari {totalPages}</span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded ml-2"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
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
                <form onSubmit={handleSubmitAdd}>
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100" id="modal-headline">
                        Tambah Kegiatan
                      </h3>
                      <div className="mt-2">
                        <label htmlFor="addJudul" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Judul
                        </label>
                        <input
                          type="text"
                          id="addJudul"
                          name="addJudul"
                          value={newItem.judul}
                          onChange={(e) => setNewItem({ ...newItem, judul: e.target.value })}
                          required
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-gray-800 dark:text-white"
                        />
                      </div>
                      <div className="mt-2">
                        <label htmlFor="addDeskripsi" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Deskripsi
                        </label>
                        <textarea
                          type="text"
                          id="addDeskripsi"
                          name="addDeskripsi"
                          value={newItem.deskripsi}
                          onChange={(e) => setNewItem({ ...newItem, deskripsi: e.target.value })}
                          required
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-gray-800 dark:text-white"
                        />
                      </div>
                      <div className="mt-2">
                        <label htmlFor="addTanggal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Tanggal
                        </label>
                        <input
                          type="date"
                          id="addTanggal"
                          name="addTanggal"
                          value={newItem.tanggal}
                          onChange={(e) => setNewItem({ ...newItem, tanggal: e.target.value })}
                          required
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-gray-800 dark:text-white"
                        />
                      </div>
                      <div className="mt-2">
                        <label htmlFor="addGambar" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Gambar
                        </label>
                        <input
                          type="file"
                          id="addGambar"
                          name="addGambar"
                          onChange={handleFileChange}
                          required
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-gray-800 dark:text-white"
                        />
                      </div>
                      {filePreview && (
                        <div className="mt-2">
                          <img src={filePreview} alt="Preview" className="w-full h-auto max-h-80 object-cover rounded-lg" />
                        </div>
                      )}
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
                      onClick={() => {
                        setShowAddModal(false);
                        setFile(null);
                        setFilePreview(null);
                      }}
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

      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-11/12 md:w-1/2">
            <h2 className="text-lg font-semibold mb-4">Edit Item</h2>
            <form onSubmit={handleSubmitEdit}>
              <div className="mb-4">
                <label htmlFor="judul" className="block text-sm font-medium text-gray-700">Judul:</label>
                <input
                  type="text"
                  id="judul"
                  value={editedItem.judul}
                  onChange={(e) => setEditedItem({ ...editedItem, judul: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700">Tanggal:</label>
                <input
                  type="date"
                  id="tanggal"
                  value={editedItem.tanggal}
                  onChange={(e) => setEditedItem({ ...editedItem, tanggal: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700">Deskripsi:</label>
                <textarea
                  type="text"
                  id="deskripsi"
                  value={editedItem.deskripsi}
                  onChange={(e) => setEditedItem({ ...editedItem, deskripsi: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
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
                      <p className="text-sm text-gray-500">Apakah Anda yakin ingin menghapus "<span className="font-semibold text-[1rem]">{selectedItemToDelete.judul}</span>"?</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
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

export default DetailKegiatan;
