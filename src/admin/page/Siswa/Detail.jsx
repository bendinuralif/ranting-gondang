import React, { useState, useEffect } from "react";
import LayoutAdmin from "../LayoutAdmin";
import {
  retrieveData,
  uploadData
} from "../../../lib/firebase/service";
import {
  collection,
  addDoc,
  getFirestore,
  deleteDoc,
  doc,
  writeBatch,
  getDocs,
  updateDoc
} from "firebase/firestore";
import app from "../../../lib/firebase/init";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

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
  const [showDeleteSelectedButton, setShowDeleteSelectedButton] = useState(false); // State untuk mengontrol visibilitas tombol "Hapus Terpilih"
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState({
    nama: "",
    no: "",
    jeniskelamin: "",
    rayon: "",
    tahun: ""
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [statistics, setStatistics] = useState([]);
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
    if (selectedTahun) {
      fetchData();
    }
  }, [selectedTahun]);

  useEffect(() => {
    const totalPagesCount = Math.ceil(data.length / rowsPerPage);
    setTotalPages(totalPagesCount);
  }, [data, rowsPerPage]);

  const fetchData = async () => {
    const db = getFirestore(app);
    try {
      const snapshot = await getDocs(collection(db, "Siswa"));
      const availableYears = Array.from(
        new Set(snapshot.docs.map((doc) => doc.data().tahun))
      ).sort((a, b) => b - a);
      setTahunOptions(availableYears);

      if (!selectedTahun && availableYears.length > 0) {
        setSelectedTahun(availableYears[0]);
      }

      const filteredData = selectedTahun
        ? snapshot.docs.filter((doc) => doc.data().tahun === selectedTahun)
        : snapshot.docs;

      const data = filteredData.map((doc) => ({ id: doc.id, ...doc.data() }));
      const filteredAndSortedData = data.filter(
        (item) => typeof item.no === "string" || typeof item.no === "number"
      ).sort((a, b) => {
        if (typeof a.no === "string" && typeof b.no === "string") {
          return a.no.localeCompare(b.no);
        } else {
          return a.no - b.no;
        }
      });

      setData(filteredAndSortedData);
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
    const selectedYear = parseInt(e.target.value);
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
  
    // Perbarui status tombol "Hapus Terpilih"
    const isCheckedItemsExist = Object.values({
      ...checkedItems,
      [itemId]: !checkedItems[itemId], // Perbarui nilai untuk item yang baru saja diubah statusnya
    }).some((isChecked) => isChecked);
    setShowDeleteSelectedButton(isCheckedItemsExist);
  };
  
  
 

  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditModalOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedItemToDelete(item);
    setItemToDeleteName(item.nama);
  };

  const confirmDelete = async () => {
    try {
      const db = getFirestore(app);
      await deleteDoc(doc(db, "Siswa", selectedItemToDelete.id));
      console.log("Item deleted successfully!");
      fetchData();
      setSelectedItemToDelete(null);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const toggleConfirmDeleteModal = () => {
    setConfirmDeleteModalOpen(!confirmDeleteModalOpen);
  };
  
  
  // Fungsi untuk menghapus item terpilih setelah konfirmasi
  const handleConfirmedDeleteSelected = async () => {
    try {
      const db = getFirestore(app);
      const batch = writeBatch(db);
      Object.entries(checkedItems).forEach(([itemId, isChecked]) => {
        if (isChecked) {
          const itemRef = doc(db, "Siswa", itemId);
          batch.delete(itemRef);
        }
      });
      await batch.commit();
      console.log("Selected items deleted successfully!");
      fetchData();
      setCheckedItems({});
      setShowDeleteSelectedButton(false); // Setelah item terpilih dihapus, sembunyikan tombol "Hapus Terpilih" lagi
      toggleConfirmDeleteModal(); // Tutup modal konfirmasi setelah penghapusan berhasil
      setConfirmDeleteModalOpen(false); // Pastikan modal konfirmasi ditutup
    } catch (error) {
      console.error("Error deleting selected items:", error);
    }
  };
  
  
  
  const confirmDeleteSelected = () => {
    // Mengumpulkan semua item yang telah dicentang
    const itemsToDelete = Object.entries(checkedItems)
      .filter(([itemId, isChecked]) => isChecked)
      .map(([itemId, isChecked]) => itemId);
  
    // Menampilkan modal konfirmasi jika ada item yang akan dihapus
    if (itemsToDelete.length > 0) {
      // Simpan item yang akan dihapus dan tampilkan modal konfirmasi
      setSelectedItemToDelete(itemsToDelete); 
      setConfirmDeleteModalOpen(true);
    } else {
      // Jika tidak ada item yang dicentang, berikan pesan kepada pengguna
      console.log("Tidak ada item yang dicentang untuk dihapus");
    }
  };
  

  const handleDeleteSelected = async () => {
    try {
      const db = getFirestore(app);
      const batch = writeBatch(db);
      
      // Loop melalui objek checkedItems untuk menghapus item yang dicentang
      for (const itemId in checkedItems) {
        if (checkedItems[itemId]) {
          const itemRef = doc(db, "Siswa", itemId);
          batch.delete(itemRef);
        }
      }
  
      // Lakukan commit batch
      await batch.commit();
      
      // Log ke konsol untuk memastikan item terpilih dihapus dengan sukses
      console.log("Selected items deleted successfully!");
  
      // Panggil fetchData untuk memperbarui tampilan setelah penghapusan
      fetchData();
  
      // Reset checkedItems dan sembunyikan tombol "Hapus Terpilih"
      setCheckedItems({});
      setShowDeleteSelectedButton(false);
  
    } catch (error) {
      console.error("Error deleting selected items:", error);
    }
  };
  

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const db = getFirestore(app);
      const itemId = selectedItem.id;
      const itemRef = doc(db, "Siswa", itemId);
      await updateDoc(itemRef, {
        nama: selectedItem.nama,
        no: selectedItem.no,
        jeniskelamin: selectedItem.jeniskelamin,
        rayon: selectedItem.rayon,
        tahun: selectedItem.tahun,
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

          <div className="flex justify-start items-center px-3 pb-3">
        {/* Tampilkan tombol "Hapus Terpilih" hanya jika ada item yang dicentang */}
        {showDeleteSelectedButton && (
          <button
          onClick={confirmDeleteSelected} // Tampilkan modal konfirmasi ketika tombol "Hapus Terpilih" diklik
          className="bg-red-500 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Hapus Terpilih
        </button>
        )}
      </div>

          <table className="w-full text-xs md:text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="p-2 md:p-3 text-center">No.</th>
                <th className="p-2 md:p-3">Nama</th>
                <th className="p-2 md:p-3">Jenis Kelamin</th>
                <th className="p-2 md:p-3">Rayon</th>
                <th className="p-2 md:p-3 text-center">Aksi</th>
                <th className="p-2 md:p-3 text-center">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      setCheckedItems(
                        Object.fromEntries(
                          paginatedData.map((item) => [item.id, e.target.checked])
                        )
                      )
                    }
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr
                  key={item.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <td className="p-2 md:p-3 text-center">{item.no}</td>
                  <td className="p-2 md:p-3">{item.nama}</td>
                  <td className="p-2 md:p-3">{item.jeniskelamin}</td>
                  <td className="p-2 md:p-3">{item.rayon}</td>
                  <td className="p-2 md:p-3 text-center">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 dark:text-blue-500 hover:underline mx-1"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="text-red-600 dark:text-red-500 hover:underline mx-1"
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </td>
                  <td className="p-2 md:p-3 text-center">
                  <input
  type="checkbox"
  checked={checkedItems[item.id] || false}
  onChange={() => handleCheckboxChange(item.id)}
/>
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

        {editModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-11/12 md:w-1/2">
              <h2 className="text-lg font-semibold mb-4">Edit Item</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="nama" className="block text-sm font-medium text-gray-700">
                    Nama:
                  </label>
                  <input
                    type="text"
                    id="nama"
                    value={selectedItem.nama}
                    onChange={(e) =>
                      setSelectedItem({ ...selectedItem, nama: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="no" className="block text-sm font-medium text-gray-700">
                    No:
                  </label>
                  <input
                    type="text"
                    id="no"
                    value={selectedItem.no}
                    onChange={(e) =>
                      setSelectedItem({ ...selectedItem, no: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="jeniskelamin" className="block text-sm font-medium text-gray-700">
                    Jenis Kelamin:
                  </label>
                  <select
                    id="jeniskelamin"
                    value={selectedItem.jeniskelamin}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        jeniskelamin: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="rayon" className="block text-sm font-medium text-gray-700">
                    Rayon:
                  </label>
                  <input
                    type="text"
                    id="rayon"
                    value={selectedItem.rayon}
                    onChange={(e) =>
                      setSelectedItem({ ...selectedItem, rayon: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="tahun" className="block text-sm font-medium text-gray-700">
                    Tahun:
                  </label>
                  <input
                    type="text"
                    id="tahun"
                    value={selectedItem.tahun}
                    onChange={(e) =>
                      setSelectedItem({ ...selectedItem, tahun: e.target.value })
                    }
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
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {selectedItemToDelete && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-11/12 md:w-1/2">
              <h2 className="text-lg font-semibold mb-4">Hapus Item</h2>
              <p>Apakah Anda yakin ingin menghapus item ini?</p>
              <p>{itemToDeleteName}</p>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setSelectedItemToDelete(null)}
                  className="bg-gray-500 text-white font-bold py-2 px-4 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="bg-red-500 text-white font-bold py-2 px-4 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {showSuccessModal && (
          <div className="fixedinset-x-0 bottom-0 flex items-center justify-center h-16 bg-green-500 text-white font-bold py-2 px-4 rounded">
          {uploadMessage}
        </div>
      )}

      {showErrorModal && (
        <div className="fixed inset-x-0 bottom-0 flex items-center justify-center h-16 bg-red-500 text-white font-bold py-2 px-4 rounded">
          {errorMessage}
        </div>
      )}
     {confirmDeleteModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
    <div className="bg-white p-6 rounded shadow-lg w-11/12 md:w-1/2">
      <h2 className="text-lg font-semibold mb-4">Hapus Item Terpilih</h2>
      <p>Apakah Anda yakin ingin menghapus item terpilih?</p>
      <div className="flex justify-end mt-4">
        <button
          onClick={() => toggleConfirmDeleteModal()}
          className="bg-gray-500 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            handleConfirmedDeleteSelected(); // Panggil fungsi untuk menghapus item terpilih
            toggleConfirmDeleteModal(); // Tutup modal konfirmasi setelah penghapusan berhasil
          }}
          className="bg-red-500 text-white font-bold py-2 px-4 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  </LayoutAdmin>
);
}

export default DetailSiswa;

