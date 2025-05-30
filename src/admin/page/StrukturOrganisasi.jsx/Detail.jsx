import React, { useState, useEffect } from "react";
import LayoutAdmin from "../LayoutAdmin";
import {
  collection,
  addDoc,
  getFirestore,
  deleteDoc,
  doc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import app from "../../../lib/firebase/init";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

function DetailStrukturOrganisasi() {
  const [data, setData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedData, setPaginatedData] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedItemToDelete, setSelectedItemToDelete] = useState(null);
  const [selectedItem, setSelectedItem] = useState({ no: "", nama: "", jabatan: "" });
  const [newItem, setNewItem] = useState({ no: "", nama: "", jabatan: "" });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const checkSession = () => {
      const userSession = sessionStorage.getItem("user");
      if (userSession) setSession(userSession);
      else window.location.href = "/login";
    };

    checkSession();
    fetchData();
  }, []);

  useEffect(() => {
    setTotalPages(Math.ceil(data.length / rowsPerPage));
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
      const snapshot = await getDocs(collection(db, "StrukturOrganisasi"));
      const res = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.sort((a, b) => a.no - b.no);
      setData(res);
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage("Error fetching data");
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
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

  const handleNextPage = () => setCurrentPage(prev => prev + 1);
  const handlePrevPage = () => setCurrentPage(prev => prev - 1);

  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditModalOpen(true);
  };

  const handleDelete = (item) => setSelectedItemToDelete(item);

  const confirmDelete = async () => {
    setLoading(true);
    try {
      const db = getFirestore(app);
      await deleteDoc(doc(db, "StrukturOrganisasi", selectedItemToDelete.id));
      fetchData();
      setSelectedItemToDelete(null);
    } catch (error) {
      console.error("Error deleting item:", error);
      setErrorMessage("Delete gagal.");
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const db = getFirestore(app);
      const { no, nama, jabatan } = selectedItem;
      const itemRef = doc(db, "StrukturOrganisasi", selectedItem.id);
      await updateDoc(itemRef, { no, nama, jabatan });
      setEditModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error updating item:", error);
      setErrorMessage("Update gagal.");
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const db = getFirestore(app);
      await addDoc(collection(db, "StrukturOrganisasi"), newItem);
      setAddModalOpen(false);
      setNewItem({ no: "", nama: "", jabatan: "" });
      fetchData();
    } catch (error) {
      console.error("Error adding item:", error);
      setErrorMessage("Add gagal.");
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutAdmin>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-lg md:text-2xl font-semibold mb-4">Detail Struktur Organisasi</h2>
        <button
          onClick={() => setAddModalOpen(true)}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
        >
          <FontAwesomeIcon icon={faPlus} /> Tambah
        </button>
        <div className="overflow-x-auto ">
          <table className="w-full text-xs md:text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="p-4"></th>
                <th scope="col" className="px-2 py-3">
                  No
                </th>
                <th scope="col" className="px-2 py-3">
                  Nama
                </th>
                <th scope="col" className="px-2 py-3">
                  Jabatan
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
                  <td className="px-2 py-2">{item.no}</td>
                  <td className="px-2 py-2">{item.nama}</td>
                  <td className="px-2 py-2">{item.jabatan}</td>
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
              <label htmlFor="rowsPerPage" className="mr-2">
                Baris per halaman:
              </label>
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
              <span>
                Halaman {currentPage} dari {totalPages}
              </span>
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
      {editModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-11/12 md:w-1/2">
            <h2 className="text-lg font-semibold mb-4">Edit Item</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="no" className="block text-sm font-medium text-gray-700">
                  No:
                </label>
                <input
                  type="number"
                  id="no"
                  value={selectedItem.no}
                  onChange={(e) => setSelectedItem({ ...selectedItem, no: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="nama" className="block text-sm font-medium text-gray-700">
                  Nama:
                </label>
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
                <label htmlFor="jabatan" className="block text-sm font-medium text-gray-700">
                  Jabatan:
                </label>
                <input
                  type="text"
                  id="jabatan"
                  value={selectedItem.jabatan}
                  onChange={(e) => setSelectedItem({ ...selectedItem, jabatan: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="bg-red-500 text-white font-bold py-2 px-4 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
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
            <h2 className="text-lg font-semibold mb-4">Tambah Struktur Organisasi</h2>
            <form onSubmit={handleSubmitAdd}>
              <div className="mb-4">
                <label htmlFor="no" className="block text-sm font-medium text-gray-700">
                  No:
                </label>
                <input
                  type="number"
                  id="no"
                  value={newItem.no}
                  onChange={(e) => setNewItem({ ...newItem, no: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="nama" className="block text-sm font-medium text-gray-700">
                  Nama:
                </label>
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
                <label htmlFor="jabatan" className="block text-sm font-medium text-gray-700">
                  Jabatan:
                </label>
                <input
                  type="text"
                  id="jabatan"
                  value={newItem.jabatan}
                  onChange={(e) => setNewItem({ ...newItem, jabatan: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="bg-red-500 text-white font-bold py-2 px-4 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
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
            <h2 className="text-lg font-semibold mb-4">Action berhasil!</h2>
            <button
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm ml-2 px-10 py-2.5"
              onClick={() => setShowSuccessModal(false)}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
      {showErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-sm w-full">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4 text-center text-red-600">Action gagal!</h2>
              <p className="text-sm text-gray-700">{errorMessage}</p>
            </div>
            <div className="bg-gray-100 p-4 flex justify-center">
              <button
                className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm ml-2 px-10 py-2.5"
                onClick={() => setShowErrorModal(false)}
              >
                Tutup
              </button>
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
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3 text-center">
            <h2 className="text-lg font-semibold mb-4">Loading...</h2>
            <p>Mohon tunggu, sedang memproses...</p>
          </div>
        </div>
      )}
    </LayoutAdmin>
  );
}

export default DetailStrukturOrganisasi;
