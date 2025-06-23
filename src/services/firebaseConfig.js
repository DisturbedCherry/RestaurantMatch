// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore"
const firebaseConfig = {
  apiKey: "AIzaSyCp6bUoEwaIQUnSIQJw-T1nu52hA8S1hac",
  authDomain: "restaurantmatch-ac7ed.firebaseapp.com",
  projectId: "restaurantmatch-ac7ed",
  storageBucket: "restaurantmatch-ac7ed.firebasestorage.app",
  messagingSenderId: "903298888350",
  appId: "1:903298888350:web:02d9afeb0cc3dfd2cac18f",
  measurementId: "G-11YRTTWB7K"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

