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
  writeBatch
} from "firebase/firestore";
import app from "../../../lib/firebase/init";
import { updateDoc } from "firebase/firestore";
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

  const [statistics, setStatistics] = useState([]);
  const [session, setSession] = useState(null); // Menyimpan informasi sesi

  // State untuk menampilkan modal konfirmasi penghapusan item terpilih
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);

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
        const mainCollectionRef = collection(db, "Siswa");
        const snapshot = await getDocs(mainCollectionRef);

        const availableYears = Array.from(
          new Set(snapshot.docs.map((doc) => doc.data().tahun))
        ).sort((a, b) => b - a);
        setTahunOptions(availableYears);

        if (!selectedTahun && availableYears.length > 0) {
          setSelectedTahun(availableYears[0]);
        }

        const filteredData = selectedTahun
          ? snapshot.docs.filter((doc) => doc.data().tahun == selectedTahun)
          : snapshot.docs;

        const data = filteredData.map((doc) => ({ id: doc.id, ...doc.data() }));

        const filteredAndSortedData = data.filter(
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

    fetchData();
  }, []);

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
        (item) => typeof item.no ===  "string" || typeof item.no === "number"
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
    setShowDeleteConfirmationModal(true); // Tampilkan modal konfirmasi penghapusan
  };

  const confirmDelete = async () => {
    try {
      const db = getFirestore(app);
      await deleteDoc(doc(db, "Siswa", selectedItemToDelete.id)); // Hapus item yang telah dikonfirmasi
      console.log("Item deleted successfully!");
      fetchData();
      setSelectedItemToDelete(null); // Kosongkan state setelah penghapusan berhasil
      setShowDeleteConfirmationModal(false); // Sembunyikan modal konfirmasi penghapusan
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleDeleteSelected = () => {
    const checkedItemIds = Object.keys(checkedItems).filter(itemId => checkedItems[itemId]);
    if (checkedItemIds.length > 0) {
      setShowDeleteConfirmationModal(true); // Tampilkan modal konfirmasi penghapusan
    } else {
      // Tampilkan pesan bahwa tidak ada item yang dipilih
      console.log("No items selected for deletion.");
    }
  };
  

  // Fungsi untuk membatalkan penghapusan item terpilih
  const cancelDeleteSelected = () => {
    setShowDeleteConfirmationModal(false); // Sembunyikan modal konfirmasi penghapusan
  };

  const renderDeleteConfirmationModal = () => {
    return (
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <FontAwesomeIcon icon={faTrashAlt} className="h-6 w-6 text-red-600" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                    Hapus Item Terpilih
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Apakah Anda yakin ingin menghapus item <span className="font-medium">{itemToDeleteName}</span>? Tindakan ini tidak dapat dibatalkan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button onClick={confirmDelete} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                Hapus
              </button>
              <button onClick={cancelDeleteSelected} type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text -gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
Batal
</button>
</div>
</div>
</div>
</div>
);
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
<div className="flex justify-start items-center px-3 pb-3">
<button
  onClick={handleDeleteSelected}
  className="bg-red-500 text-white font-bold py-2 px-4 rounded mr-2"
>
  Hapus Terpilih
</button>


      </div>

      {/* Tabel data siswa */}
      <table className="w-full text-xs md:text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="p-4">
              <input
                type="checkbox"
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  const newCheckedItems = {};
                  data.forEach((item) => {
                    newCheckedItems[item.id] = isChecked;
                  });
                  setCheckedItems(newCheckedItems);
                }}
              />
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
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <td className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={checkedItems[item.id] || false}
                  onChange={() => handleCheckboxChange(item.id)}
                />
              </td>
              <td className="px-2 py-2">{item.no}</td>
              <td className="px-2 py-2">{item.nama}</td>
              <td className="px-2 py-2">{item.jeniskelamin}</td>
              <td className="px-2 py-2">{item.rayon}</td>
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
      {/* Pagination */}
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
      {/* Pagination controls */}
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
  {/* Modal konfirmasi penghapusan */}
  {showDeleteConfirmationModal && renderDeleteConfirmationModal()}
</LayoutAdmin>
);
}

export default DetailSiswa;
