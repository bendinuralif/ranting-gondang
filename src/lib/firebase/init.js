// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtrDHzXypLYSpaEsJgxQ7WVpwZKjYlyYQ",
  authDomain: "ranting-gondang.firebaseapp.com",
  projectId: "ranting-gondang",
  storageBucket: "ranting-gondang.appspot.com",
  messagingSenderId: "440387526706",
  appId: "1:440387526706:web:7168dd55ba99e5db321c2b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


export default app