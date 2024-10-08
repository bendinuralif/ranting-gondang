import React, { useState, useEffect } from "react";
import LayoutAdmin from "../LayoutAdmin";
import { collection, addDoc, getFirestore, deleteDoc, doc, writeBatch, getDocs, updateDoc } from "firebase/firestore";
import app from "../../../lib/firebase/init";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt, faPlus, faPrint, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { useDebounce } from "use-debounce";
import * as XLSX from "xlsx";

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
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedItemToDelete, setSelectedItemToDelete] = useState(null);
  const [itemToDeleteName, setItemToDeleteName] = useState("");
  const [showDeleteSelectedButton, setShowDeleteSelectedButton] = useState(false);
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState({
    nama: "",
    no: "",
    jeniskelamin: "",
    rayon: "",
    tahun: "",
  });
  const [newItem, setNewItem] = useState({
    nama: "",
    no: "",
    jeniskelamin: "",
    rayon: "",
    tahun: "",
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
    setLoading(true);
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
      const filteredAndSortedData = data
        .filter(
          (item) => typeof item.no === "string" || typeof item.no === "number"
        )
        .sort((a, b) => {
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
    setLoading(false);
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  const handleUpload = async () => {
    try {
      if (file) {
        setLoading(true);
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
    setLoading(false);
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
  }, [data, currentPage, rowsPerPage, selectedTahun, searchQuery]);

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

  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditModalOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedItemToDelete(item);
    setItemToDeleteName(item.nama);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      const db = getFirestore(app);
      await deleteDoc(doc(db, "Siswa", selectedItemToDelete.id));
      console.log("Item deleted successfully!");
      fetchData();
      setSelectedItemToDelete(null);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
    setLoading(false);
  };

  const toggleConfirmDeleteModal = () => {
    setConfirmDeleteModalOpen(!confirmDeleteModalOpen);
  };

  const handleConfirmedDeleteSelected = async () => {
    setLoading(true);
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
      setShowDeleteSelectedButton(false);
      toggleConfirmDeleteModal();
      setConfirmDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting selected items:", error);
    }
    setLoading(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
    setLoading(false);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const db = getFirestore(app);
      await addDoc(collection(db, "Siswa"), newItem);
      console.log("Item added successfully!");
      setAddModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error adding item:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const filteredData = data.filter(
      (item) =>
        item.nama.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        item.jeniskelamin.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        item.rayon.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        item.tahun.toString().includes(debouncedSearchQuery.toLowerCase())
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
      "jenis kelamin": item.jeniskelamin,
      rayon: item.rayon,
      tahun: item.tahun,
    }));

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DataSiswa");

    // Generate file Excel dengan nama file yang mencantumkan tahun yang dipilih
    const fileName = selectedTahun ? `DataSiswa_${selectedTahun}.xlsx` : `DataSiswa.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const handlePrintAll = () => {
    let printContent = `
      <h2 className="text-lg font-semibold">Siswa</h2>
      <table border="1" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>No.</th>
            <th>Nama</th>
            <th>Jenis Kelamin</th>
            <th>Rayon</th>
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
          <td>${item.jeniskelamin}</td>
          <td>${item.rayon}</td>
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
        <h2 className="text-lg md:text-2xl font-semibold mb-4">Detail Siswa</h2>
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
                <th className="p-3">Jenis Kelamin</th>
                <th className="p-3">Rayon</th>
                <th className="p-3">Tahun</th>
                <th className="p-3 text-center">Aksi</th>
                <th className="p-3 text-center">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      setCheckedItems(
                        Object.fromEntries(
                          paginatedData.map((item) => [
                            item.id,
                            e.target.checked,
                          ])
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
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="p-3 text-center">{index + 1}</td>
                  <td className="p-3">{item.nama}</td>
                  <td className="p-3">{item.jeniskelamin}</td>
                  <td className="p-3">{item.rayon}</td>
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
              ))}
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
                  <label
                    htmlFor="nama"
                    className="block text-sm font-medium text-gray-700"
                  >
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
                  <label
                    htmlFor="no"
                    className="block text-sm font-medium text-gray-700"
                  >
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
                  <label
                    htmlFor="jeniskelamin"
                    className="block text-sm font-medium text-gray-700"
                  >
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
                  <label
                    htmlFor="rayon"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Rayon:
                  </label>
                  <input
                    type="text"
                    id="rayon"
                    value={selectedItem.rayon}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        rayon: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="tahun"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tahun:
                  </label>
                  <input
                    type="text"
                    id="tahun"
                    value={selectedItem.tahun}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        tahun: e.target.value,
                      })
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

        {addModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-11/12 md:w-1/2">
              <h2 className="text-lg font-semibold mb-4">Tambah Siswa</h2>
              <form onSubmit={handleAddSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="nama"
                    className="block text-sm font-medium text-gray-700"
                  >
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
                  <label
                    htmlFor="no"
                    className="block text-sm font-medium text-gray-700"
                  >
                    No:
                  </label>
                  <input
                    type="text"
                    id="no"
                    value={newItem.no}
                    onChange={(e) =>
                      setNewItem({ ...newItem, no: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="jeniskelamin"
                    className="block text-sm font-medium text-gray-700"
                  >
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
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="rayon"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Rayon:
                  </label>
                  <input
                    type="text"
                    id="rayon"
                    value={newItem.rayon}
                    onChange={(e) =>
                      setNewItem({ ...newItem, rayon: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="tahun"
                    className="block text-sm font-medium text-gray-700"
                  >
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
              <h2 className="text-lg font-semibold mb-4">
                Hapus Item Terpilih
              </h2>
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
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Loading...</h2>
          </div>
        </div>
      )}
    </LayoutAdmin>
  );
}

export default DetailSiswa;
