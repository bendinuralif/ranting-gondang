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
