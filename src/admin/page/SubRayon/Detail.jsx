import React, { useState, useEffect } from "react";
import LayoutAdmin from "../LayoutAdmin";
import { retrieveData, uploadData } from "../../../lib/firebase/service";
import { collection, addDoc, getFirestore, deleteDoc, doc } from "firebase/firestore";
import app from "../../../lib/firebase/init";
import { updateDoc } from "firebase/firestore";

function DetailSubRayon() {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTahun, setSelectedTahun] = useState("");
  const [paginatedData, setPaginatedData] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedItemToDelete, setSelectedItemToDelete] = useState(null);
  const [selectedItem, setSelectedItem] = useState({
    sub: "",
    no: "",
    rayon: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
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
      const res = await retrieveData("SubRayon", db);
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
    try {
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const json = JSON.parse(e.target.result);
          const db = getFirestore(app);
          for (const item of json) {
            await addDoc(collection(db, "SubRayon"), item);
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

  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditModalOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedItemToDelete(item);
  };

  const confirmDelete = async () => {
    try {
      const db = getFirestore(app);
      await deleteDoc(doc(db, "SubRayon", selectedItemToDelete.id));
      console.log("Item deleted successfully!");
      fetchData();
      setSelectedItemToDelete(null);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const db = getFirestore(app);
      const { sub, rayon } = selectedItem;
      const itemId = selectedItem.id;
      const itemRef = doc(db, "SubRayon", itemId);
      await updateDoc(itemRef, {
        sub: sub,
        rayon: rayon,
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-lg md:text-2xl font-semibold mb-4">Detail Sub Rayon</h2>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-xs md:text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="p-4"></th>
                <th scope="col" className="px-2 py-3">
                  No
                </th>
                <th scope="col" className="px-2 py-3">
                  Sub
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
                  <td className="px-4 py-2"></td>
                  <td className="px-2 py-2">{index + 1}</td>
                  <td className="px-2 py-2">{item.sub}</td>
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
                  currentPage === 1 ? "cursor-not-allowed" : "bg-red-500 text-white"
                }`}
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <span className="mx-2 text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className={`px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                  currentPage === totalPages ? "cursor-not-allowed" : "bg-red-500 text-white"
                }`}
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
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
                style={{ alignSelf: "flex-start" }}
              >
                X
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6 mb-6 md:grid-cols-1">
                <div>
                  <label
                    htmlFor="sub"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Sub
                  </label>
                  <input
                    type="text"
                    id="sub"
                    value={selectedItem.sub}
                    onChange={(e) =>
                      setSelectedItem({ ...selectedItem, sub: e.target.value })
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Masukan sub"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-6 mb-6 md:grid-cols-1">
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
                    onChange={(e) =>
                      setSelectedItem({ ...selectedItem, rayon: e.target.value })
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Masukan Rayon"
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
        </div>
      )}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Upload berhasil!</h2>
            <button
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm ml-2 px-10 py-2.5 "
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
              <h2 className="text-lg font-semibold mb-4 text-center text-red-600">Upload gagal!</h2>
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
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h2>
            <p>Apakah Anda yakin ingin menghapus item "{selectedItemToDelete.sub}"?</p>
            <div className="flex justify-end">
              <button
                className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm ml-2 px-4 py-2.5"
                onClick={confirmDelete}
              >
                Ya
              </button>
              <button
                className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm ml-2 px-4 py-2.5"
                onClick={() => setSelectedItemToDelete(null)}
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

export default DetailSubRayon;