import React, { useState, useEffect, useCallback } from "react";
import LayoutAdmin from "../LayoutAdmin";
import { collection, addDoc, getFirestore, deleteDoc, doc, writeBatch, getDocs, updateDoc } from "firebase/firestore";
import app from "../../../lib/firebase/init";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPrint, faPlus, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { useDebounce } from "use-debounce";
import * as XLSX from "xlsx"; // Import library xlsx

const DetailWarga = () => {
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
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedItemToDelete, setSelectedItemToDelete] = useState(null);
  const [itemToDeleteName, setItemToDeleteName] = useState("");
  const [showDeleteSelectedButton, setShowDeleteSelectedButton] = useState(false);
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState({
    nama: "",
    no: "",
    noCabang: "017", // Diisi otomatis dengan noCabang "017"
    noInduk: "", // Akan diisi otomatis dengan format 6 digit
    jeniskelamin: "",
    alamat: "",
    tahun: "",
    niw: ""
  });
  const [newItem, setNewItem] = useState({
    nama: "",
    no: "",
    noCabang: "017", // Diisi otomatis dengan noCabang "017"
    noInduk: "", // Akan diisi otomatis dengan format 6 digit
    jeniskelamin: "",
    alamat: "",
    tahun: "",
    niw: ""
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [loading, setLoading] = useState(false);

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

  const fetchData = useCallback(async () => {
    const db = getFirestore(app);
    try {
      const snapshot = await getDocs(collection(db, "Warga"));

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        tahun: parseInt(doc.data().tahun, 10), // Ensure the year is an integer
      }));

      const availableYears = Array.from(
        new Set(data.map((doc) => doc.tahun))
      ).sort((a, b) => b - a);
      setTahunOptions(availableYears);

      const filteredData = selectedTahun
        ? data.filter((item) => item.tahun === selectedTahun)
        : data;

      const filteredAndSortedData = filteredData.filter(
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
  }, [selectedTahun]);

  useEffect(() => {
    if (selectedTahun) {
      fetchData();
    }
  }, [selectedTahun, fetchData]);

  useEffect(() => {
    const totalPagesCount = Math.ceil(data.length / rowsPerPage);
    setTotalPages(totalPagesCount);
  }, [data, rowsPerPage]);

  // Function to get the next available number for the selected year
  const getNextNoForYear = async (selectedYear) => {
    const db = getFirestore(app);

    // Fetch all data for the selected year
    const snapshot = await getDocs(collection(db, "Warga"));
    const dataForYear = snapshot.docs
      .map((doc) => doc.data())
      .filter((item) => item.tahun === selectedYear);

    if (dataForYear.length === 0) {
      // Jika belum ada data di tahun tersebut, mulai dari nomor 1
      return 1;
    }

    // Temukan nomor terbesar dan tambahkan 1
    const maxNo = Math.max(...dataForYear.map((item) => parseInt(item.no, 10)));
    return maxNo + 1;
  };

  const generateUniqueNIW = async (tahun, noCabang, no) => {
    const db = getFirestore(app);
    let niw = `${tahun.toString().slice(-2)}${String(noCabang).padStart(3, '0')}${String(no).padStart(6, '0')}`;
    let isUnique = false;
    let counter = 1;

    while (!isUnique) {
      // Cek apakah ada data dengan NIW yang sama
      const snapshot = await getDocs(collection(db, "Warga"));
      const existingData = snapshot.docs.find(doc => doc.data().niw === niw);

      if (existingData) {
        // Jika NIW sudah ada, tambahkan counter untuk membuatnya unik
        niw = `${tahun.toString().slice(-2)}${String(noCabang).padStart(3, '0')}${String(no).padStart(6, '0')}${counter}`;
        counter += 1;
      } else {
        // Jika NIW tidak ada, maka NIW ini unik
        isUnique = true;
      }
    }

    return niw;
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
            await addDoc(collection(db, "Warga"), item);
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
    const selectedYear = parseInt(e.target.value, 10);
    setSelectedTahun(selectedYear);
  };

  const handleCheckboxChange = (itemId) => {
    setCheckedItems((prevCheckedItems) => {
      const newCheckedItems = {
        ...prevCheckedItems,
        [itemId]: !prevCheckedItems[itemId],
      };
      setShowDeleteSelectedButton(Object.values(newCheckedItems).some(Boolean));
      return newCheckedItems;
    });
  };

  const handleEdit = async (item) => {
    let niw = item.niw;
    if (!niw || niw.trim() === "") {
      niw = await generateUniqueNIW(item.tahun, item.noCabang, item.no);
    }

    setSelectedItem({
      ...item,
      noCabang: "017", // Diisi otomatis dengan noCabang
      noInduk: String(item.no).padStart(6, '0'),  // noInduk diisi otomatis dari no dengan format 6 digit
      niw // Set correct NIW
    });
    setEditModalOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedItemToDelete(item);
    setItemToDeleteName(item.nama);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      const db = getFirestore(app);
      await deleteDoc(doc(db, "Warga", selectedItemToDelete.id));
      console.log("Item deleted successfully!");
      fetchData();
      setSelectedItemToDelete(null);
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleConfirmDeleteModal = () => {
    setConfirmDeleteModalOpen(!confirmDeleteModalOpen);
  };

  const handleConfirmedDeleteSelected = async () => {
    try {
      setLoading(true);
      const db = getFirestore(app);
      const batch = writeBatch(db);
      Object.entries(checkedItems).forEach(([itemId, isChecked]) => {
        if (isChecked) {
          const itemRef = doc(db, "Warga", itemId);
          batch.delete(itemRef);
        }
      });
      await batch.commit();
      console.log("Selected items deleted successfully!");
      fetchData();
      setCheckedItems({});
      setShowDeleteSelectedButton(false);
    } catch (error) {
      console.error("Error deleting selected items:", error);
    } finally {
      setLoading(false);
      toggleConfirmDeleteModal();
    }
  };

  const confirmDeleteSelected = () => {
    const itemsToDelete = Object.entries(checkedItems)
      .filter(([itemId, isChecked]) => isChecked)
      .map(([itemId, isChecked]) => itemId);

    if (itemsToDelete.length > 0) {
      setSelectedItemToDelete(itemsToDelete);
      setConfirmDeleteModalOpen(true);
    } else {
      console.log("Tidak ada item yang dicentang untuk dihapus");
    }
  };

  const handleDeleteSelected = async () => {
    try {
      setLoading(true);
      const db = getFirestore(app);
      const batch = writeBatch(db);

      for (const itemId in checkedItems) {
        if (checkedItems[itemId]) {
          const itemRef = doc(db, "Warga", itemId);
          batch.delete(itemRef);
        }
      }

      await batch.commit();
      console.log("Selected items deleted successfully!");
      fetchData();
      setCheckedItems({});
      setShowDeleteSelectedButton(false);
    } catch (error) {
      console.error("Error deleting selected items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const db = getFirestore(app);

      // Generate NIW yang unik
      const niw = await generateUniqueNIW(selectedItem.tahun, selectedItem.noCabang, selectedItem.no);

      const itemId = selectedItem.id;
      const itemRef = doc(db, "Warga", itemId);

      await updateDoc(itemRef, {
        nama: selectedItem.nama,
        no: selectedItem.no,
        noCabang: "017", 
        noInduk: String(selectedItem.no).padStart(6, '0'),
        jeniskelamin: selectedItem.jeniskelamin,
        alamat: selectedItem.alamat,
        tahun: selectedItem.tahun,
        niw: niw
      });
      console.log("Item updated successfully!");
      setEditModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error updating item:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const db = getFirestore(app);

      // Dapatkan nomor berikutnya untuk tahun yang dipilih
      const nextNo = await getNextNoForYear(newItem.tahun);
    
      // Set nilai nomor dan noInduk otomatis
      const no = nextNo.toString();
      const noInduk = no.padStart(6, '0');

      // Generate NIW yang unik
      const niw = await generateUniqueNIW(newItem.tahun, newItem.noCabang, no);

      // Tambahkan item baru ke database
      await addDoc(collection(db, "Warga"), {
        ...newItem,
        no: no,  // Assign nomor otomatis
        noInduk: noInduk, // Assign noInduk
        niw: niw,
      });

      console.log("New item added successfully!");
      setAddModalOpen(false);
      fetchData(); // Reload data
    } catch (error) {
      console.error("Error adding new item:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filteredData = data.filter((item) =>
      item.nama.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      item.jeniskelamin.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      item.alamat.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      item.tahun.toString().includes(debouncedSearchQuery.toLowerCase()) ||
      item.niw.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) // Tambahkan filter untuk niw
    );
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    setPaginatedData(filteredData.slice(startIndex, endIndex));
  }, [data, currentPage, rowsPerPage, debouncedSearchQuery]);

  // Fungsi untuk ekspor data ke Excel
  const handleExportExcel = () => {
    const formattedData = data.map((item) => ({
      id: item.id,
      no: item.no,
      nama: item.nama,
      niw: item.niw, // Tambahkan niw ke ekspor Excel
      "jenis kelamin": item.jeniskelamin,
      alamat: item.alamat,
      tahun: item.tahun,
    }));

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DataWarga");

    const fileName = selectedTahun ? `DataWarga_${selectedTahun}.xlsx` : "DataWarga.xlsx";

    XLSX.writeFile(wb, fileName);
  };

  const handlePrintAll = () => {
    let printContent = `
      <h2>Detail Warga</h2>
      <table border="1" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>NIW</th>
            <th>Jenis Kelamin</th>
            <th>Alamat</th>
            <th>Tahun</th>
          </tr>
        </thead>
        <tbody>
    `;

    data.forEach((item, index) => {
      printContent += `
        <tr>
          <td>${index + 1}</td>
          <td>${item.nama}</td>
          <td>${item.niw}</td>
          <td>${item.jeniskelamin}</td>
          <td>${item.alamat}</td>
          <td>${item.tahun}</td>
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

  return (
    <LayoutAdmin>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-lg md:text-2xl font-semibold mb-4">Detail Warga</h2>
        <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <label htmlFor="tahun" className="mr-2 font-medium">Pilih Tahun:</label>
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
            <div>
              <button
                onClick={handleExportExcel} // Tombol ekspor ke Excel
                className="bg-green-600 text-white font-bold py-2 px-4 rounded mr-2"
              >
                <FontAwesomeIcon icon={faFileExcel} className="mr-2" /> Ekspor Excel
              </button>
              <button
                onClick={handlePrintAll}
                className="bg-green-500 text-white font-bold py-2 px-4 rounded mr-2"
              >
                <FontAwesomeIcon icon={faPrint} className="mr-2" /> Cetak Semua
              </button>
              <button
                onClick={() => setAddModalOpen(true)}
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
              >
                <FontAwesomeIcon icon={faPlus} /> Tambah
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border rounded px-3 py-1 w-full"
            />
            {showDeleteSelectedButton && (
              <button
                onClick={confirmDeleteSelected}
                className="bg-red-500 text-white font-bold py-2 px-4 rounded ml-2"
              >
                Hapus Terpilih
              </button>
            )}
          </div>
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="p-3 text-center">No.</th>
                <th className="p-3">Nama</th>
                <th className="p-3">NIW</th> {/* Tambahkan header NIW */}
                <th className="p-3">Jenis Kelamin</th>
                <th className="p-3">Alamat</th>
                <th className="p-3">Tahun</th>
                <th className="p-3 text-center">Aksi</th>
                <th className="p-3 text-center">
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
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr
                    key={item.id}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="p-3 text-center">{index + 1}</td>
                    <td className="p-3">{item.nama}</td>
                    <td className="p-3">{item.niw}</td> {/* Tampilkan nilai NIW */}
                    <td className="p-3">{item.jeniskelamin}</td>
                    <td className="p-3">{item.alamat}</td>
                    <td className="p-3">{item.tahun}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
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
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={checkedItems[item.id] || false}
                        onChange={() => handleCheckboxChange(item.id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-3 text-center">
                    Data tidak ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
            <div>
              <label htmlFor="rowsPerPage" className="mr-2 font-medium">Baris per halaman:</label>
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
                      setSelectedItem({ ...selectedItem, no: e.target.value, noInduk: String(e.target.value).padStart(6, '0') })
                    } // Update noInduk saat no berubah
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="noCabang" className="block text-sm font-medium text-gray-700">
                    No Cabang:
                  </label>
                  <input
                    type="text"
                    id="noCabang"
                    value={selectedItem.noCabang}
                    readOnly // Diisi otomatis, tidak bisa diubah
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="noInduk" className="block text-sm font-medium text-gray-700">
                    No Induk:
                  </label>
                  <input
                    type="text"
                    id="noInduk"
                    value={selectedItem.noInduk}
                    readOnly // Diisi otomatis, tidak bisa diubah
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
                   <option value="" disabled>Silahkan dipilih</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="alamat" className="block text-sm font-medium text-gray-700">
                    Alamat:
                  </label>
                  <input
                    type="text"
                    id="alamat"
                    value={selectedItem.alamat}
                    onChange={(e) =>
                      setSelectedItem({ ...selectedItem, alamat: e.target.value })
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
                <div className="mb-4">
                  <label htmlFor="niw" className="block text-sm font-medium text-gray-700">
                    NIW:
                  </label>
                  <input
                    type="text"
                    id="niw"
                    value={`${selectedItem.tahun.toString().slice(-2)}${String(selectedItem.noCabang).padStart(3, '0')}${String(selectedItem.noInduk).padStart(6, '0')}`}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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

        {addModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-11/12 md:w-1/2">
              <h2 className="text-lg font-semibold mb-4">Tambah Item</h2>
              <form onSubmit={handleAdd}>
                <div className="mb-4">
                  <label htmlFor="nama" className="block text-sm font-medium text-gray-700">
                    Nama:
                  </label>
                  <input
                    type="text"
                    id="nama"
                    value={newItem.nama}
                    onChange={(e) =>
                      setNewItem({ ...newItem, nama: e.target.value })
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
                    value={newItem.no}
                    onChange={(e) =>
                      setNewItem({ ...newItem, no: e.target.value, noInduk: String(e.target.value).padStart(6, '0') })
                    } // Update noInduk saat no berubah
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="noCabang" className="block text-sm font-medium text-gray-700">
                    No Cabang:
                  </label>
                  <input
                    type="text"
                    id="noCabang"
                    value={newItem.noCabang}
                    readOnly // Diisi otomatis, tidak bisa diubah
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="noInduk" className="block text-sm font-medium text-gray-700">
                    No Induk:
                  </label>
                  <input
                    type="text"
                    id="noInduk"
                    value={newItem.noInduk}
                    readOnly // Diisi otomatis, tidak bisa diubah
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
                    value={newItem.jeniskelamin}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        jeniskelamin: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="" disabled>Silahkan dipilih</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="alamat" className="block text-sm font-medium text-gray-700">
                    Alamat:
                  </label>
                  <input
                    type="text"
                    id="alamat"
                    value={newItem.alamat}
                    onChange={(e) =>
                      setNewItem({ ...newItem, alamat: e.target.value })
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
                    value={newItem.tahun}
                    onChange={(e) =>
                      setNewItem({ ...newItem, tahun: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="niw" className="block text-sm font-medium text-gray-700">
                    NIW:
                  </label>
                  <input
                    type="text"
                    id="niw"
                    value={`${newItem.tahun.toString().slice(-2)}${String(newItem.noCabang).padStart(3, '0')}${String(newItem.noInduk).padStart(6, '0')}`}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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

        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg">
              <p className="text-lg font-semibold">Loading...</p>
            </div>
          </div>
        )}

        {showSuccessModal && (
          <div className="fixed inset-x-0 bottom-0 flex items-center justify-center h-16 bg-blue-500 text-white font-bold py-2 px-4 rounded">
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
                    handleConfirmedDeleteSelected();
                    toggleConfirmDeleteModal();
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
};

export default DetailWarga;
