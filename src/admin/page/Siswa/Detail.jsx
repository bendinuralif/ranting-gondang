import React, { useState, useEffect } from "react";
import LayoutAdmin from "../LayoutAdmin";
import { retrieveData, uploadData } from "../../../lib/firebase/service";
import { collection, addDoc, getFirestore, deleteDoc, doc } from "firebase/firestore";
import app from "../../../lib/firebase/init";
import { updateDoc } from "firebase/firestore";

function DetailSiswa() {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tahunOptions, setTahunOptions] = useState([]);
  const [selectedTahun, setSelectedTahun] = useState();
  const [paginatedData, setPaginatedData] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedItemToDelete, setSelectedItemToDelete] = useState(null);
  const [itemToDeleteName, setItemToDeleteName] = useState("");

  const [selectedItem, setSelectedItem] = useState({
    nama: "",
    no: "",
    jenisKelamin: "",
    rayon: "",
    tahun: ""
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, [selectedTahun]);

  useEffect(() => {
    const totalPagesCount = Math.ceil(data.length / rowsPerPage);
    setTotalPages(totalPagesCount);
  }, [data, rowsPerPage]);

  const fetchData = async () => {
    const db = getFirestore(app);
    try {
      const res = await retrieveData("Siswa", db);
      const availableYears = Array.from(new Set(res.map((item) => item.tahun))).sort((a, b) => b - a);
      setTahunOptions(availableYears);

      if (!selectedTahun && availableYears.length > 0) {
        setSelectedTahun(availableYears[0]);
      }

      const filteredData = selectedTahun ? res.filter((item) => item.tahun == selectedTahun) : res;

      const filteredAndSortedData = filteredData.filter(
        (item) => typeof item.no === "string" || typeof item.no === "number"
      );
      const sortedData = filteredAndSortedData.sort((a, b) => {
        if (typeof a.no === "string" && typeof b.no === "string") {
          return a.no.localeCompare(b.no);
        } else {
          return a.no - b.no;
        }
      });

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
          const db = getFirestore(app);
          for (const item of json) {
            await addDoc(collection(db, "Siswa"), item);
          }
          console.log("Data uploaded successfully!");
          fetchData();
          setUploadMessage("Upload berhasil!");
          setShowSuccessModal(true);
          setTimeout(() => {
            setShowSuccessModal(false);
          }, 3000);
        };
        reader.readAsText(file);
      } else {
        console.error("Please select a file to upload.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setErrorMessage("Upload gagal.");
      setShowErrorModal(true);
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

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleChangeTahun = (e) => {
    const selectedYear = parseInt(e.target.value); // Mengubah string menjadi angka
    setSelectedTahun(selectedYear);
  };

  useEffect(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    setPaginatedData(data.slice(startIndex, endIndex));
  }, [data, currentPage, rowsPerPage, selectedTahun]);

  const handleCheckboxChange = (itemId) => {
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [itemId]: !prevCheckedItems[itemId],
    }));
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditModalOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedItemToDelete(item);
    setItemToDeleteName(item.nama); // Set nama item yang akan dihapus
  };
  

  const confirmDelete = async () => {
    try {
      const db = getFirestore(app);
      await deleteDoc(doc(db, "Siswa", selectedItemToDelete.id)); // Hapus item yang telah dikonfirmasi
      console.log("Item deleted successfully!");
      fetchData();
      setSelectedItemToDelete(null); // Kosongkan state setelah penghapusan berhasil
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const db = getFirestore(app);
      const { nama, no, jeniskelamin, rayon, tahun } = selectedItem; // Definisi variabel
      const itemId = selectedItem.id; // Ubah id menjadi itemId
      const itemRef = doc(db, "Siswa", itemId);
      await updateDoc(itemRef, {
        nama: nama,
        no: no,
        jeniskelamin: jeniskelamin,
        rayon: rayon,
        tahun: tahun,
      });
      console.log("Item updated successfully!");
      setEditModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  return (
    <LayoutAdmin>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 ">
        <h2 className="text-lg md:text-2xl font-semibold mb-4">Detail Siswa</h2>
        <div className="overflow-x-auto">
        <div className="flex justify-end items-center px-3 pb-3">
              <label htmlFor="tahun" className="mr-2">
                Pilih Tahun:
              </label>
              <select
                id="tahun"
                onChange={handleChangeTahun}
                value={selectedTahun}
                className="border rounded px-3 py-1"
              >
                {tahunOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

          <table className="w-full text-xs md:text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="p-4">
                </th>
                <th scope="col" className="px-2 py-3">
                  No
                </th>
                <th scope="col" className="px-2 py-3">
                  Nama
                </th>
                <th scope="col" className="px-2 py-3">
                  Jenis Kelamin
                </th>
                <th scope="col" className="px-2 py-3">
                  Rayon
                </th>
                <th scope="col" className="px-2 py-3">
                  Edit
                </th>
                <th scope="col" className="px-2 py-3">
                  Hapus
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-4 py-2">
                  </td>
                  <td className="px-2 py-2">{item.no}</td>
                  <td className="px-2 py-2">{item.nama}</td>
                  <td className="px-2 py-2">{item.jeniskelamin}</td>
                  <td className="px-2 py-2">{item.rayon}</td>
                  <td className="px-2 py-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                  </td>
                  <td className="px-2 py-2">
                    <button
                      onClick={() => handleDelete(item)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end items-center px-3">
            <label htmlFor="rowsPerPage" className="mr-2">
              Baris per halaman:
            </label>
            <select
              id="rowsPerPage"
              onChange={handleChangeRowsPerPage}
              value={rowsPerPage}
              className="border rounded px-3 py-1"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={"All"}>Semua</option>
            </select>
          </div>
          <div className="flex justify-end items-start p-4">
            <div>
              <button
                className={`px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                  currentPage === 1
                    ? "cursor-not-allowed"
                    : "bg-red-500 text-white"
                }`}
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <span className="mx-2 text-sm text-gray-600">
                Halaman {currentPage} dari {totalPages}
              </span>
              <button
                className={`px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                  currentPage === totalPages
                    ? "cursor-not-allowed"
                    : "bg-red-500 text-white"
                }`}
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      {editModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold mb-4">Edit Item</h2>
              <button
                className="text-black font-semibold"
                onClick={() => setEditModalOpen(false)}
                style={{ alignSelf: 'flex-start' }}
              >
                X
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6 mb-6 md:grid-cols-1">
                <div>
                  <label
                    htmlFor="first_name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Nama
                  </label>
                  <input
                    type="text"
                    id="nama"
                    value={selectedItem.nama}
                    onChange={(e) => setSelectedItem({ ...selectedItem, nama: e.target.value })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Masukan Nama"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="last_name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    No
                  </label>
                  <input
                    type="number"
                    id="no"
                    value={selectedItem.no}
                    onChange={(e) => setSelectedItem({ ...selectedItem, no: e.target.value })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Masukan Nomor"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="jeniskelamin"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Jenis Kelamin
                  </label>
                  <input
                    type="text"
                    id="jeniskelamin"
                    value={selectedItem.jeniskelamin}
                    onChange={(e) => setSelectedItem({ ...selectedItem, jeniskelamin: e.target.value })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Masukan Jenis Kelamin"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="rayon"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Rayon
                  </label>
                  <input
                    type="text"
                    id="rayon"
                    value={selectedItem.rayon}
                    onChange={(e) => setSelectedItem({ ...selectedItem, rayon: e.target.value })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Masukan Rayon"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="tahun"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Tahun
                  </label>
                  <input
                    type="number"
                    id="tahun"
                    value={selectedItem.tahun}
                    onChange={(e) => setSelectedItem({ ...selectedItem, tahun: parseInt(e.target.value) })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Masukan Tahun"
                    required
                  />
                </div>
              </div>
              <div className="mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg">
            <p className="text-xl font-semibold">{uploadMessage}</p>
          </div>
        </div>
      )}
      {showErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg">
            <p className="text-xl text-red-500 font-semibold">{errorMessage}</p>
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

export default DetailSiswa;
