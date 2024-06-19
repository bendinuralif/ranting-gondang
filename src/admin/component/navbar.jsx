import { Avatar, Dropdown, Navbar } from "flowbite-react";
import logo from '../assets/img/Logo.png';
import React, { useState, useEffect } from "react";
import app from "../../../src/lib/firebase/init";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export function CustomNavbar({ toggleSidebar }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [session, setSession] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedItem, setEditedItem] = useState({
    nama: '',
    niw: '',
    password: '',
    role: '',
    gambar: ''
  });
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedItemToDelete, setSelectedItemToDelete] = useState(null);
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const [data, setData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
          setEditedItem(userDoc.data());
        }
      } else {
        setUser(null);
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkSession = () => {
      try {
        const userSession = JSON.parse(sessionStorage.getItem("user"));
        if (userSession) {
          setSession(userSession);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Failed to parse session storage", error);
        navigate("/login");
      }
    };

    checkSession();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedItem({
      ...editedItem,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleUploadGambar = async () => {
    if (file) {
      const fileRef = ref(storage, `images/${file.name}`);
      await uploadBytes(fileRef, file);
      return await getDownloadURL(fileRef);
    }
    return null;
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setEditLoading(true);

    try {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        let updatedData = { ...editedItem };

        if (file) {
          const fileURL = await handleUploadGambar();
          updatedData = { ...updatedData, gambar: fileURL };
        }

        await updateDoc(userDocRef, updatedData);
        setUserData(updatedData);
        setShowEditModal(false);
      }
    } catch (error) {
      console.error("Failed to update user data", error);
    }

    setEditLoading(false);
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
      await deleteDoc(doc(db, "user", selectedItemToDelete.id));
      console.log("Item deleted successfully!");

      const fetchData = async () => {
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

  return (
    <>
      <Navbar fluid rounded className="bg-gray-800">
        <Navbar.Toggle onClick={toggleSidebar} />
        <Navbar.Brand href="/">
          <a className="flex items-center pr-4 md:pl-5" href="/">
            <img src={logo} alt="Logo" className="h-12" />
            <span className="self-center text-l md:text-xl font-semibold whitespace-nowrap text-white">
              PSHT RANTING GONDANG
            </span>
          </a>
        </Navbar.Brand>
        <div className="flex md:order-2 md:pr-10">
          {session && (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar
                  alt="User settings"
                  img={session.gambar}
                  rounded
                />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm">{session.nama}</span>
                <span className="block truncate text-sm font-medium">{session.niw}</span>
              </Dropdown.Header>
              <Dropdown.Item as="a" href="/edit-user">Settings</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item as="a" href="/logout">Logout</Dropdown.Item>
            </Dropdown>
          )}
        </div>
      </Navbar>
    </>
  );
}

export default CustomNavbar;
