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

  const handleDeleteSelected = async () => {
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
      setCheckedItems({}); // Kosongkan state setelah penghapusan berhasil
    } catch (error) {
      console.error("Error deleting selected items:", error);
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

          <div className="flex justify-start items-center px-3 pb-3">
            <button
              onClick={handleDeleteSelected}
              className="bg-red-500 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Hapus Terpilih
            </button>
          </div>

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
                className={`px-2 py-1 rounded hover:bg-gray-200 ${
                  currentPage === 1 && "bg-gray-200"
                }`}
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                className={`px-2 py-1 rounded hover:bg-gray-200 ${
                  currentPage === totalPages && "bg-gray-200"
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
    </LayoutAdmin>
  );
}

export default DetailSiswa;
