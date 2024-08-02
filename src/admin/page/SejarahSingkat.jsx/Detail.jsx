import React, { useState, useEffect } from "react";
import LayoutAdmin from "../LayoutAdmin";
import { collection, addDoc, getFirestore, deleteDoc, doc, updateDoc, getDocs } from "firebase/firestore";
import app from "../../../lib/firebase/init";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

function DetailKetuaRantingSingkat() {
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
    no: "",
    nama: "",
    tahun: "",
  });
  const [newItem, setNewItem] = useState({
    no: "",
    nama: "",
    tahun: "",
  });
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    setLoading(true);
    const db = getFirestore(app);
    try {
      const snapshot = await getDocs(collection(db, "KetuaRanting"));
      const res = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(res);
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage("Error fetching data");
      setShowErrorModal(true);
    } finally {
      setLoading(false);
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
          const db = getFirestore(app);
          for (const item of json) {
            await addDoc(collection(db, "KetuaRanting"), item);
          }
          fetchData();
          setUploadMessage("Upload berhasil!");
          setShowSuccessModal(true);
          setTimeout(() => {
            setShowSuccessModal(false);
          }, 3000);
        };
        reader.readAsText(file);
      } else {
        setErrorMessage("Please select a file to upload.");
        setShowErrorModal(true);
      }
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
    setSelectedItemToDelete(item);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      const db = getFirestore(app);
      await deleteDoc(doc(db, "KetuaRanting", selectedItemToDelete.id));
      setData(data.filter((item) => item.id !== selectedItemToDelete.id));
      setSelectedItemToDelete(null);
    } catch (error) {
      console.error("Error deleting item:", error);
      setErrorMessage("Delete gagal.");
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const db = getFirestore(app);
      const { no, nama, tahun } = selectedItem;
      const itemId = selectedItem.id;
      const itemRef = doc(db, "KetuaRanting", itemId);
      await updateDoc(itemRef, {
        no,
        nama,
        tahun,
      });
      setData(data.map((item) => (item.id === itemId ? selectedItem : item)));
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating item:", error);
      setErrorMessage("Update gagal.");
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewItem = () => {
    setAddModalOpen(true);
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const db = getFirestore(app);
      const { no, nama, tahun } = newItem;
      const docRef = await addDoc(collection(db, "KetuaRanting"), {
        no,
        nama,
        tahun,
      });
      setData([...data, { id: docRef.id, ...newItem }]);
      setNewItem({ no: "", nama: "", tahun: "" });
      setAddModalOpen(false);
    } catch (error) {
      console.error("Error adding new item:", error);
      setErrorMessage("Add gagal.");
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutAdmin>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-lg md:text-2xl font-semibold mb-4">Detail Ketua Ranting</h2>
        <div className="flex justify-end items-center mb-4">
          <button
            onClick={handleAddNewItem}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            <FontAwesomeIcon icon={faPlus} /> Tambah
          </button>
        </div>
        {loading && <div className="flex justify-center mb-4">Loading...</div>}
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full text-xs md:text-sm text-left text-gray-500">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
              <tr>
                <th className="p-4"></th>
                <th className="px-2 py-3">No</th>
                <th className="px-2 py-3">Nama</th>
                <th className="px-2 py-3">Tahun</th>
                <th className="px-2 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={item.id} className="bg-white border-b hover:bg-gray-100 transition">
                  <td className="px-4 py-2"></td>
                  <td className="px-2 py-2">{item.no}</td>
                  <td className="px-2 py-2">{item.nama}</td>
                  <td className="px-2 py-2">{item.tahun}</td>
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
                <label htmlFor="no" className="block text-sm font-medium text-gray-700">No:</label>
                <input
                  type="text"
                  id="no"
                  value={selectedItem.no}
                  onChange={(e) => setSelectedItem({ ...selectedItem, no: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
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
                <label htmlFor="tahun" className="block text-sm font-medium text-gray-700">Tahun:</label>
                <input
                  type="text"
                  id="tahun"
                  value={selectedItem.tahun}
                  onChange={(e) => setSelectedItem({ ...selectedItem, tahun: e.target.value })}
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
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {addModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-11/12 md:w-1/2">
            <h2 className="text-lg font-semibold mb-4">Tambah Ketua Ranting</h2>
            <form onSubmit={handleSubmitAdd}>
              <div className="mb-4">
                <label htmlFor="newNo" className="block text-sm font-medium text-gray-700">No:</label>
                <input
                  type="text"
                  id="newNo"
                  value={newItem.no}
                  onChange={(e) => setNewItem({ ...newItem, no: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="newNama" className="block text-sm font-medium text-gray-700">Nama:</label>
                <input
                  type="text"
                  id="newNama"
                  value={newItem.nama}
                  onChange={(e) => setNewItem({ ...newItem, nama: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="newTahun" className="block text-sm font-medium text-gray-700">Tahun:</label>
                <input
                  type="text"
                  id="newTahun"
                  value={newItem.tahun}
                  onChange={(e) => setNewItem({ ...newItem, tahun: e.target.value })}
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
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Save"}
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
              <h2 className="text-lg font-semibold mb-4 text-center text-red-600">Error</h2>
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

export default DetailKetuaRantingSingkat;
