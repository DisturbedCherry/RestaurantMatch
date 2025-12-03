// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCp6bUoEwaIQUnSIQJw-T1nu52hA8S1hac",
  authDomain: "restaurantmatch-ac7ed.firebaseapp.com",
  projectId: "restaurantmatch-ac7ed",
  storageBucket: "restaurantmatch-ac7ed.firebasestorage.app",
  messagingSenderId: "903298888350",
  appId: "1:903298888350:web:02d9afeb0cc3dfd2cac18f",
  measurementId: "G-11YRTTWB7K"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app);
export const db = getFirestore(app);