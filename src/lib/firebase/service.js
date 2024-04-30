import app from './init'
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    query,
    updateDoc,
    where,
  } from "firebase/firestore";
  const firestore = getFirestore(app);

  export async function retrieveData(collectionName) {
    const snapshot = await getDocs(collection(firestore, collectionName));
  
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  
    return data;
  }

  export async function uploadData(collectionName, file) {
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const json = JSON.parse(e.target.result);
        for (const item of json) {
          await addDoc(collection(firestore, collectionName), item);
        }
        console.log('Data uploaded successfully!');
      };
      reader.readAsText(file);
    } catch (error) {
      console.error("Error uploading data:", error);
      throw error;
    }
  }

  