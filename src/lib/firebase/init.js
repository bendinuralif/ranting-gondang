// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC5EHbbnFwYlFpT-uLF5bnjhQaIcgvD3p4",
  authDomain: "psht-6cf11.firebaseapp.com",
  projectId: "psht-6cf11",
  storageBucket: "psht-6cf11.appspot.com",
  messagingSenderId: "11127280696",
  appId: "1:11127280696:web:f66003812f7e49619e42cd",
  measurementId: "G-9FGPG4D9VR"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


export default app