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
  databaseURL: "https://ranting-gondang-3cf5e-default-rtdb.firebaseio.com",
  projectId: "ranting-gondang-3cf5e",
  storageBucket: "ranting-gondang-3cf5e.appspot.com",
  messagingSenderId: "303123109508",
  appId: "1:303123109508:web:ead3fea28468aa8a7c54d1",
  measurementId: "G-0V5LB8L8Y8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


export default app