import { Avatar, Dropdown, Navbar } from "flowbite-react";
import logo from '../assets/img/Logo.png';
import React, { useState, useEffect } from "react";
import app from "../../../src/lib/firebase/init";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const auth = getAuth(app);
const db = getFirestore(app);

export function CustomNavbar({ toggleSidebar }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [session, setSession] = useState(null); // Define session state
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        console.log("User authenticated:", currentUser);

        // Fetch user data from Firestore
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
          console.log("User data from Firestore:", userDoc.data());
        } else {
          console.log("No such document!");
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

  return (
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
            {/* <Dropdown.Item>Dashboard</Dropdown.Item> */}
            <Dropdown.Item onClick={() => navigate('/setting')}>Settings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item as="a" href="/logout">Logout</Dropdown.Item>
          </Dropdown>
        )}
      </div>
    </Navbar>
  );
}

export default CustomNavbar;
