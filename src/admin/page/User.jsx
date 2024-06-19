import React, { useState, useEffect } from "react";
import LayoutAdmin from "./LayoutAdmin";
import {
  addDoc,
  collection,
  getFirestore,
  deleteDoc,
  updateDoc,
  getDocs,
  doc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import app from "./../../lib/firebase/init";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function User() {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedData, setPaginatedData] = useState([]);
  const [selectedItemToDelete, setSelectedItemToDelete] = useState(null);
  const [selectedItem, setSelectedItem] = useState({
    gambar: "",
    nama: "",
    niw: "",
    password: "",
    role: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editedItem, setEditedItem] = useState({});
  const [newItem, setNewItem] = useState({
    gambar: "",
    nama: "",
    niw: "",
    password: "",
    role: "",
  });
  const [sortOrder, setSortOrder] = useState("asc");
  const [session, setSession] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const checkSession = () => {
      const userSession = sessionStorage.getItem("user");
      if (userSession) {
        const user = JSON.parse(userSession);
        setSession(user);
        if (user.role !== "Admin") {
          setAlertMessage("Halaman tidak tersedia untuk Anda");
          setTimeout(() => {
            window.location.href = "/dashboard"; // Redirect after showing alert message
          }, 1000);
        }
      } else {
        window.location.href = "/dashboard";
      }
    };

    checkSession();

    const fetchData = async () => {
      const db = getFirestore(app);
      try {
        const mainCollectionRef = collection(db, "user");
        const snapshot = await getDocs(mainCollectionRef);
        const res = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        res.sort((a, b) => {
          if (sortOrder === "asc") {
            return a.nama.localeCompare(b.nama);
          } else {
            return b.nama.localeCompare(a.nama);
          }
        });
        setData(res);
      } catch (error) {
        console.error("Error fetching Firestore data:", error);
      }
    };

    fetchData();
  }, [sortOrder]);

  useEffect(() => {
    const totalPagesCount = Math.ceil(data.length / rowsPerPage);
    setTotalPages(totalPagesCount);
  }, [data, rowsPerPage]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    setPaginatedData(data.slice(startIndex, endIndex));
  }, [data, currentPage, rowsPerPage]);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    setFilePreview(URL.createObjectURL(uploadedFile));
  };

  const handleUploadGambar = async () => {
    try {
      if (file) {
        const storage = getStorage(app);
        const storageRef = ref(storage, `images/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        setUploadMessage("Upload berhasil!");
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 3000);
        return downloadURL;
      } else {
        console.error("Silakan pilih file untuk diunggah.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setErrorMessage("Upload gagal.");
      setShowErrorModal(true);
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
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

  const handleEdit = (item) => {
    setEditedItem(item);
    setShowEditModal(true);
    setFilePreview(item.gambar);
  };

  const handleDelete = (item) => {
    setSelectedItemToDelete(item);
    setDeleteConfirmationModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleteLoading(true);
      const db = getFirestore(app);
      await deleteDoc(doc(db, "user", selectedItemToDelete.id));
      console.log("Item deleted successfully!");
      const fetchData = async () => {
        const db = getFirestore(app);
        try {
          const mainCollectionRef = collection(db, "user");
          const snapshot = await getDocs(mainCollectionRef);
          const res = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          res.sort((a, b) => {
            if (sortOrder === "asc") {
              return a.nama.localeCompare(b.nama);
            } else {
              return b.nama.localeCompare(a.nama);
            }
          });
          setData(res);
        } catch (error) {
          console.error("Error fetching Firestore data:", error);
        }
      };
      fetchData();
      setSelectedItemToDelete(null);
      setDeleteConfirmationModalOpen(false);
      setDeleteLoading(false);
    } catch (error) {
      console.error("Error deleting item:", error);
      setDeleteLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setSelectedItemToDelete(null);
    setDeleteConfirmationModalOpen(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      setEditLoading(true);
      const db = getFirestore(app);
      const itemId = editedItem.id;
      const itemRef = doc(db, "user", itemId);

      let downloadURL = editedItem.gambar;
      if (file) {
        downloadURL = await handleUploadGambar();
      }

      await updateDoc(itemRef, { ...editedItem, gambar: downloadURL });
      console.log("Item updated successfully!");
      setShowEditModal(false);
      const fetchData = async () => {
        const db = getFirestore(app);
        try {
          const mainCollectionRef = collection(db, "user");
          const snapshot = await getDocs(mainCollectionRef);
          const res = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          res.sort((a, b) => {
            if (sortOrder === "asc") {
              return a.nama.localeCompare(b.nama);
            } else {
              return b.nama.localeCompare(a.nama);
            }
          });
          setData(res);
        } catch (error) {
          console.error("Error fetching Firestore data:", error);
        }
      };
      fetchData();
      setEditLoading(false);
    } catch (error) {
      console.error("Error updating item:", error);
      setEditLoading(false);
    }
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    try {
      setAddLoading(true);
      const downloadURL = await handleUploadGambar();
      if (downloadURL) {
        const db = getFirestore(app);
        await addDoc(collection(db, "user"), { ...newItem, gambar: downloadURL });
        console.log("Item added successfully!");
        setNewItem({
          gambar: "",
          nama: "",
          niw: "",
          password: "",
          role: "",
        });
        setFile(null);
        setFilePreview(null);
        setShowAddModal(false);
        const fetchData = async () => {
          const db = getFirestore(app);
          try {
            const mainCollectionRef = collection(db, "user");
            const snapshot = await getDocs(mainCollectionRef);
            const res = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            res.sort((a, b) => {
              if (sortOrder === "asc") {
                return a.nama.localeCompare(b.nama);
              } else {
                return b.nama.localeCompare(a.nama);
              }
            });
            setData(res);
          } catch (error) {
            console.error("Error fetching Firestore data:", error);
          }
        };
        fetchData();
      } else {
        console.error("Gagal mengunggah gambar.");
      }
      setAddLoading(false);
    } catch (error) {
      console.error("Error adding item:", error);
      setAddLoading(false);
    }
  };

  const handleShowImage = (image) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  if (alertMessage) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-bold mb-4">{alertMessage}</h1>
        </div>
      </div>
    );
  }
  return (
    <LayoutAdmin>
      <div className="container mx-auto py-8 px-10">
        <h1 className="text-3xl font-bold mb-6">User</h1>

        <div className="flex justify-between items-center mb-4">
          <div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setShowAddModal(true)}
            >
              Tambah Pengguna
            </button>
          </div>
          <div>
            <label htmlFor="rowsPerPage" className="mr-2">Baris per halaman:</label>
            <select id="rowsPerPage" value={rowsPerPage} onChange={handleChangeRowsPerPage}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value="All">Semua</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Gambar</th>
                <th className="py-2 px-4 border-b cursor-pointer" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                  Nama {sortOrder === "asc" ? "▲" : "▼"}
                </th>
                <th className="py-2 px-4 border-b">NIW</th>
                <th className="py-2 px-4 border-b">Role</th>
                <th className="py-2 px-4 border-b">Password</th>
                <th className="py-2 px-4 border-b">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item) => (
                <tr key={item.id}>
                  <td className="py-2 px-4 border-b">
                    {item.gambar && (
                      <img
                        src={item.gambar}
                        alt="User"
                        className="h-16 w-16 object-cover rounded"
                        onClick={() => handleShowImage(item.gambar)}
                        style={{ cursor: "pointer" }}
                      />
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">{item.nama}</td>
                  <td className="py-2 px-4 border-b">{item.niw}</td>
                  <td className="py-2 px-4 border-b">{item.role}</td>
                  <td className="py-2 px-4 border-b">{showPassword ? item.password : "******"}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      className="text-blue-500 hover:text-blue-700 mr-2"
                      onClick={() => handleEdit(item)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(item)}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <button
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Sebelumnya
          </button>
          <span>
            Halaman {currentPage} dari {totalPages}
          </span>
          <button
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Berikutnya
          </button>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-8 rounded">
      <h2 className="text-xl font-bold mb-4">Tambah Pengguna</h2>
      <form onSubmit={handleSubmitAdd}>
        <div className="mb-4">
          <label className="block text-gray-700">Nama</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={newItem.nama}
            onChange={(e) => setNewItem({ ...newItem, nama: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">NIW</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={newItem.niw}
            onChange={(e) => setNewItem({ ...newItem, niw: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            className="w-full px-3 py-2 border rounded"
            value={newItem.password}
            onChange={(e) => setNewItem({ ...newItem, password: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Role</label>
          <select
            className="w-full px-3 py-2 border rounded"
            value={newItem.role}
            onChange={(e) => setNewItem({ ...newItem, role: e.target.value })}
            required
          >
            <option value="">Pilih Role</option>
            <option value="Admin">Admin</option>
            <option value="Pengurus">Pengurus</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Gambar</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
          {filePreview && (
            <img src={filePreview} alt="Preview" className="mt-2 h-32 w-32 object-cover rounded" />
          )}
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {addLoading ? "Menambahkan..." : "Tambah"}
          </button>
          <button
            type="button"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
            onClick={() => setShowAddModal(false)}
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  </div>
)}



{showEditModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-8 rounded">
      <h2 className="text-xl font-bold mb-4">Edit Pengguna</h2>
      <form onSubmit={handleSubmitEdit}>
        <div className="mb-4">
          <label className="block text-gray-700">Nama</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={editedItem.nama}
            onChange={(e) => setEditedItem({ ...editedItem, nama: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">NIW</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={editedItem.niw}
            onChange={(e) => setEditedItem({ ...editedItem, niw: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            className="w-full px-3 py-2 border rounded"
            value={editedItem.password}
            onChange={(e) => setEditedItem({ ...editedItem, password: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Role</label>
          <select
            className="w-full px-3 py-2 border rounded"
            value={editedItem.role}
            onChange={(e) => setEditedItem({ ...editedItem, role: e.target.value })}
            required
          >
            <option value="">Pilih Role</option>
            <option value="Admin">Admin</option>
            <option value="Pengurus">Pengurus</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Gambar</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {filePreview && (
            <img src={filePreview} alt="Preview" className="mt-2 h-32 w-32 object-cover rounded" />
          )}
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {editLoading ? "Menyimpan..." : "Simpan"}
          </button>
          <button
            type="button"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
            onClick={() => setShowEditModal(false)}
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  </div>
)}


      {showImageModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-middle bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <img src={selectedImage} alt="Selected Image" className="max-w-full h-auto mx-auto" />
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => setShowImageModal(false)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmationModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded">
            <h2 className="text-xl font-bold mb-4">Konfirmasi Penghapusan</h2>
            <p>Apakah Anda yakin ingin menghapus pengguna ini?</p>
            <div className="flex justify-between mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={confirmDelete}
              >
                {deleteLoading ? "Menghapus..." : "Hapus"}
              </button>
              <button
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
                onClick={handleCancelDelete}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </LayoutAdmin>
  );
}

export default User;
