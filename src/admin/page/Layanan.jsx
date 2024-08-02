import React, { useState, useEffect } from "react";
import LayoutAdmin from "./LayoutAdmin";
import { retrieveData, uploadData } from "./../../lib/firebase/service";
import { collection, addDoc, getFirestore, deleteDoc, doc, updateDoc } from "firebase/firestore";
import app from "./../../lib/firebase/init";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTrashAlt, faPrint } from '@fortawesome/free-solid-svg-icons';
import 'tailwindcss/tailwind.css';

function LayananAdmin() {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedData, setPaginatedData] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null); 
  const [disabledButtons, setDisabledButtons] = useState([]);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const checkSession = () => {
      const userSession = sessionStorage.getItem("user");
      if (!userSession) {
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
      const res = await retrieveData("Layanan", db);
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
            await addDoc(collection(db, "Layanan"), item);
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

  const handleSubmit = async (item) => {
    try {
      const db = getFirestore(app);
      const itemId = item.id;
      const itemRef = doc(db, "Layanan", itemId);
      await updateDoc(itemRef, {
        ...item, 
        tanggalSelesai: new Date().toISOString(), 
      });
      console.log("Item updated successfully with completion date!");
      fetchData(); 
      setEditingItemId(null); 
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleEdit = (item) => {
    if (!editingItemId) {
      handleSubmit(item); 
      setEditingItemId(item.id);
      setDisabledButtons((prevButtons) => [...prevButtons, item.id]);
    }
  };

  const confirmDelete = async (itemToDelete) => {
    try {
      const db = getFirestore(app);
      await deleteDoc(doc(db, "Layanan", itemToDelete.id));
      console.log("Item deleted successfully!");
      fetchData();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return new Date(dateString).toLocaleString('id-ID', options);
  };

  const handlePrintAll = () => {
    let printContent = `
      <h2>Detail Layanan</h2>
      <table border="1" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>No Telepon</th>
            <th>Alamat</th>
            <th>Deskripsi</th>
            <th>Tanggal Selesai</th>
          </tr>
        </thead>
        <tbody>
    `;

    data.forEach((item, index) => {
      printContent += `
        <tr>
          <td>${index + 1}</td>
          <td>${item.nama}</td>
          <td>${item.noTelepon}</td>
          <td>${item.alamat}</td>
          <td>${item.deskripsi}</td>
          <td>${item.tanggalSelesai ? formatDate(item.tanggalSelesai) : "Belum Selesai"}</td>
        </tr>
      `;
    });

    printContent += `
        </tbody>
      </table>
    `;

    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const handlePrint = (item) => {
    let printContent = `
      <h2>Detail Layanan</h2>
      <table border="1" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>No Telepon</th>
            <th>Alamat</th>
            <th>Deskripsi</th>
            <th>Tanggal Selesai</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>${item.nama}</td>
            <td>${item.noTelepon}</td>
            <td>${item.alamat}</td>
            <td>${item.deskripsi}</td>
            <td>${item.tanggalSelesai ? formatDate(item.tanggalSelesai) : "Belum Selesai"}</td>
          </tr>
        </tbody>
      </table>
    `;

    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <LayoutAdmin>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-lg md:text-2xl font-semibold mb-4">Layanan PSHT Ranting Gondang</h2>
        <div className="flex justify-end mb-4">
          <button
            onClick={handlePrintAll}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            <FontAwesomeIcon icon={faPrint} className="mr-2" /> Cetak Semua
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Telepon</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alamat</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selesai</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hapus</th>
                <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cetak</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.nama}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.noTelepon}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.alamat}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.deskripsi}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.tanggalSelesai ? formatDate(item.tanggalSelesai) : (
                      <button
                        onClick={() => handleEdit(item)}
                        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                          editingItemId === item.id && 'opacity-50 cursor-not-allowed'
                        }`}
                        disabled={editingItemId === item.id || disabledButtons.includes(item.id)}
                      >
                        <FontAwesomeIcon icon={faCheck} className="mr-2" /> Selesai
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => setItemToDelete(item)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                      <FontAwesomeIcon icon={faTrashAlt} className="mr-2" /> Hapus
                    </button>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handlePrint(item)}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-2 rounded"
                    >
                    <FontAwesomeIcon icon={faPrint} className="m-1" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {itemToDelete && (
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
                    <FontAwesomeIcon icon={faTrashAlt} className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Konfirmasi Hapus</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">Apakah Anda yakin ingin menghapus "<span className="font-semibold text-[1rem]">{itemToDelete.nama}</span>"?</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => {
                    confirmDelete(itemToDelete);
                    setItemToDelete(null);
                  }}
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Ya
                </button>
                <button
                  onClick={() => setItemToDelete(null)}
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

export default LayananAdmin;
