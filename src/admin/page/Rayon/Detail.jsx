import React, { useState, useEffect } from "react";
import LayoutAdmin from "../LayoutAdmin";
import { collection, addDoc, getFirestore, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import app from "../../../lib/firebase/init";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

function DetailRayon() {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedData, setPaginatedData] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedItemToDelete, setSelectedItemToDelete] = useState(null);
  const [selectedItem, setSelectedItem] = useState({
    nama: "",
    rayon: "",
  });
  const [newItem, setNewItem] = useState({
    nama: "",
    rayon: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    fetchData();
  }, []);

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
      const snapshot = await getDocs(collection(db, "Rayon"));
      const res = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(res);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage("Please select a file to upload.");
      setShowErrorModal(true);
      return;
    }
    
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const json = JSON.parse(e.target.result);
        const db = getFirestore(app);
        for (const item of json) {
          await addDoc(collection(db, "Rayon"), item);
        }
        fetchData();
        setUploadMessage("Upload berhasil!");
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 3000);
      };
      reader.readAsText(file);
    } catch (error) {
      console.error("Error uploading file:", error);
      setErrorMessage("Upload gagal.");
      setShowErrorModal(true);
    }
  };

  const handleChangeRowsPerPage = (e) => {
    const value = e.target.value;
    setRowsPerPage(value === "All" ? data.length : parseInt(value, 10));
    setCurrentPage(1);
  };

  const handleNextPage = () => setCurrentPage((prevPage) => prevPage + 1);
  const handlePrevPage = () => setCurrentPage((prevPage) => prevPage - 1);

  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditModalOpen(true);
  };

  const handleDelete = (item) => {
    setData(data.filter(i => i.id !== item.id));
    setSelectedItemToDelete(item);
  };

  const confirmDelete = async () => {
    try {
      const db = getFirestore(app);
      await deleteDoc(doc(db, "Rayon", selectedItemToDelete.id));
      setSelectedItemToDelete(null);
    } catch (error) {
      console.error("Error deleting item:", error);
      setErrorMessage("Delete gagal.");
      setShowErrorModal(true);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const db = getFirestore(app);
      await updateDoc(doc(db, "Rayon", selectedItem.id), {
        nama: selectedItem.nama,
        rayon: selectedItem.rayon,
      });
      setIsLoading(false);
      setEditModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error updating item:", error);
      setIsLoading(false);
      setErrorMessage("Update gagal.");
      setShowErrorModal(true);
    }
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const db = getFirestore(app);
      await addDoc(collection(db, "Rayon"), newItem);
      setIsLoading(false);
      setAddModalOpen(false);
      setNewItem({ nama: "", rayon: "" });
      fetchData();
    } catch (error) {
      console.error("Error adding item:", error);
      setIsLoading(false);
      setErrorMessage("Add gagal.");
      setShowErrorModal(true);
    }
  };

  return (
    <LayoutAdmin>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-lg md:text-2xl font-semibold mb-4">Detail Rayon</h2>
        <div className="flex justify-end items-center mb-4">
          <button
            onClick={() => setAddModalOpen(true)}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            <FontAwesomeIcon icon={faPlus} /> Tambah Rayon
          </button>
        </div>
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full text-xs md:text-sm text-left text-gray-500">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
              <tr>
                <th className="p-4"></th>
                <th className="px-2 py-3">No</th>
                <th className="px-2 py-3">Nama</th>
                <th className="px-2 py-3">Rayon</th>
                <th className="px-2 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={item.id} className="bg-white border-b hover:bg-gray-100 transition">
                  <td className="px-4 py-2"></td>
                  <td className="px-2 py-2">{index + 1}</td>
                  <td className="px-2 py-2">{item.nama}</td>
                  <td className="px-2 py-2">{item.rayon}</td>
                  <td className="px-2 py-2 flex space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center p-4 bg-gray-50">
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
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition disabled:bg-gray-300"
              >
                Prev
              </button>
              <span>Halaman {currentPage} dari {totalPages}</span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition disabled:bg-gray-300"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {editModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-11/12 md:w-1/2">
            <h2 className="text-lg font-semibold mb-4">Edit Item</h2>
            <form onSubmit={handleSubmitEdit}>
              <div className="mb-4">
                <label htmlFor="nama" className="block text-sm font-medium text-gray-700">Nama:</label>
                <input
                  type="text"
                  id="nama"
                  value={selectedItem.nama}
                  onChange={(e) => setSelectedItem({ ...selectedItem, nama: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="rayon" className="block text-sm font-medium text-gray-700">Rayon:</label>
                <input
                  type="text"
                  id="rayon"
                  value={selectedItem.rayon}
                  onChange={(e) => setSelectedItem({ ...selectedItem, rayon: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="bg-red-500 text-white font-bold py-2 px-4 rounded mr-2 hover:bg-red-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {addModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-11/12 md:w-1/2">
            <h2 className="text-lg font-semibold mb-4">Tambah Rayon</h2>
            <form onSubmit={handleSubmitAdd}>
              <div className="mb-4">
                <label htmlFor="nama" className="block text-sm font-medium text-gray-700">Nama:</label>
                <input
                  type="text"
                  id="nama"
                  value={newItem.nama}
                  onChange={(e) => setNewItem({ ...newItem, nama: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="rayon" className="block text-sm font-medium text-gray-700">Rayon:</label>
                <input
                  type="text"
                  id="rayon"
                  value={newItem.rayon}
                  onChange={(e) => setNewItem({ ...newItem, rayon: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="bg-red-500 text-white font-bold py-2 px-4 rounded mr-2 hover:bg-red-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Upload berhasil!</h2>
            <button
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition"
              onClick={() => setShowSuccessModal(false)}
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {showErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4 text-center text-red-600">Upload gagal!</h2>
              <p className="text-sm text-gray-700">{errorMessage}</p>
            </div>
            <div className="bg-gray-100 p-4 flex justify-center">
              <button
                className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition"
                onClick={() => setShowErrorModal(false)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedItemToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-11/12 md:w-1/2 p-6">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <FontAwesomeIcon icon={faTrashAlt} className="h-6 w-6 text-red-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Konfirmasi Hapus</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Apakah Anda yakin ingin menghapus "<span className="font-semibold">{selectedItemToDelete.nama}</span>"?</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                onClick={confirmDelete}
                type="button"
                className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition"
              >
                Ya
              </button>
              <button
                onClick={() => setSelectedItemToDelete(null)}
                type="button"
                className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-600 transition"
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      )}
    </LayoutAdmin>
  );
}

export default DetailRayon;
