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
import { faEdit, faEye, faEyeSlash, faTimes } from "@fortawesome/free-solid-svg-icons";

function User() {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
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
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedItem, setEditedItem] = useState({});
  const [sortOrder, setSortOrder] = useState("asc");
  const [session, setSession] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    const checkSession = () => {
      const userSession = JSON.parse(sessionStorage.getItem("user"));
      if (userSession) {
        setSession(userSession);
      } else {
        window.location.href = "/login";
      }
    };

    checkSession();

    const fetchData = async () => {
      const db = getFirestore(app);
      try {
        const mainCollectionRef = collection(db, "user");
        const snapshot = await getDocs(mainCollectionRef);
        const res = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        const filteredData = res.filter((user) => user.niw === session?.niw);
        filteredData.sort((a, b) => {
          if (sortOrder === "asc") {
            return a.nama.localeCompare(b.nama);
          } else {
            return b.nama.localeCompare(a.nama);
          }
        });
        setData(filteredData);
      } catch (error) {
        console.error("Error fetching Firestore data:", error);
      }
    };

    fetchData();
  }, [sortOrder, session]);

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

  const handleEdit = (item) => {
    setEditedItem(item);
    setShowEditModal(true);
    setFilePreview(item.gambar);
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
      setEditLoading(false);
      fetchData();
    } catch (error) {
      console.error("Error updating item:", error);
      setEditLoading(false);
    }
  };

  const handleShowImage = (image) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  return (
    <LayoutAdmin>
      <div className="container mx-auto py-8 px-10">
        <h1 className="text-4xl font-bold mb-8 text-center">User Profile</h1>
        {data.length > 0 && (
          <UserProfile
            data={data[0]}
            onEdit={handleEdit}
            onShowImage={handleShowImage}
            showPassword={showPassword}
            togglePasswordVisibility={togglePasswordVisibility}
          />
        )}
      </div>
      {showEditModal && (
        <EditModal
          editedItem={editedItem}
          setEditedItem={setEditedItem}
          handleSubmitEdit={handleSubmitEdit}
          handleFileChange={handleFileChange}
          filePreview={filePreview}
          showPassword={showPassword}
          editLoading={editLoading}
          setShowEditModal={setShowEditModal}
        />
      )}
      {showImageModal && (
        <ImageModal
          selectedImage={selectedImage}
          setShowImageModal={setShowImageModal}
        />
      )}
    </LayoutAdmin>
  );
}

function UserProfile({ data, onEdit, onShowImage, showPassword, togglePasswordVisibility }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 relative border border-gray-200 max-w-md mx-auto">
      <div className="flex flex-col items-center">
        {data.gambar ? (
          <img
            src={data.gambar}
            alt="User"
            className="h-32 w-32 object-cover rounded-full shadow-lg cursor-pointer border-2 border-blue-500 mb-4"
            onClick={() => onShowImage(data.gambar)}
          />
        ) : (
          <div className="h-32 w-32 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold text-gray-500 border-2 border-blue-500 mb-4">
            {data.nama.charAt(0)}
          </div>
        )}
        <h2 className="text-2xl font-bold text-blue-700 mb-1">{data.nama}</h2>
        <p className="text-gray-600 mb-1">Niw: {data.niw}</p>
        <p className="text-gray-600 capitalize mb-1">Role: {data.role}</p>
  <p className="text-gray-600 mb-4">
          Password: {showPassword ? data.password : "******"}<button
      className="text-blue-500 hover:text-blue-700 mb-4 pl-3"
      onClick={togglePasswordVisibility}
    >
      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
    </button>
  </p>
        
  <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    onClick={() => onEdit(data)}
  >
    <FontAwesomeIcon icon={faEdit} /> Edit
  </button>
</div>
    </div>
  );
}

function EditModal({
  editedItem,
  setEditedItem,
  handleSubmitEdit,
  handleFileChange,
  filePreview,
  showPassword,
  editLoading,
  setShowEditModal,
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit User</h2>
          <button
            className="text-gray-700 hover:text-gray-900"
            onClick={() => setShowEditModal(false)}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <form onSubmit={handleSubmitEdit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={editedItem.nama}
              onChange={(e) =>
                setEditedItem({ ...editedItem, nama: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">NIW</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={editedItem.niw}
              onChange={(e) =>
                setEditedItem({ ...editedItem, niw: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-3 py-2 border rounded"
              value={editedItem.password}
              onChange={(e) =>
                setEditedItem({ ...editedItem, password: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Image</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {filePreview && (
              <img
                src={filePreview}
                alt="Preview"
                className="mt-2 h-32 w-32 object-cover rounded-full"
              />
            )}
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {editLoading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ImageModal({ selectedImage, setShowImageModal }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
        <img
          src={selectedImage}
          alt="Selected"
          className="max-w-full h-auto mx-auto"
        />
        <button
          onClick={() => setShowImageModal(false)}
          className="mt-4 w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default User;
