// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjGfC4O_uLbLYlI3mopO14ia4utlWIVEE",
  authDomain: "sh-terate-9a765.firebaseapp.com",
  projectId: "sh-terate-9a765",
  storageBucket: "sh-terate-9a765.appspot.com",
  messagingSenderId: "430090302022",
  appId: "1:430090302022:web:ac5f24ce709da185d75047",
  measurementId: "G-G35VZF83YM"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


export default app