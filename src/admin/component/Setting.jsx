import React, { useState, useEffect } from 'react';
import app from '../../../src/lib/firebase/init';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

const auth = getAuth(app);
const db = getFirestore(app);

const Setting = () => {
  const [userData, setUserData] = useState({
    nama: '',
    niw: '',
    gambar: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, userData);
      alert('User information updated successfully');
    }
  };

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nama</label>
          <input type="text" name="nama" value={userData.nama} onChange={handleChange} />
        </div>
        <div>
          <label>NIW</label>
          <input type="text" name="niw" value={userData.niw} onChange={handleChange} />
        </div>
        <div>
          <label>Gambar URL</label>
          <input type="text" name="gambar" value={userData.gambar} onChange={handleChange} />
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default Setting;
