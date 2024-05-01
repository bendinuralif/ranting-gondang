// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDL5POZE7pQ8ga6pBsQTAyv-PznZypetNE",
  authDomain: "ranting-gondang-3cf5e.firebaseapp.com",
  projectId: "ranting-gondang-3cf5e",
  storageBucket: "ranting-gondang-3cf5e.appspot.com",
  messagingSenderId: "303123109508",
  appId: "1:303123109508:web:e36a505d4d83acc07c54d1",
  measurementId: "G-9C33BZ0LFG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app