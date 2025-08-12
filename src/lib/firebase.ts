
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "hsrp-saarthi",
  appId: "1:712063525086:web:be6947051395e3bcc8a24f",
  storageBucket: "hsrp-saarthi.firebasestorage.app",
  apiKey: "AIzaSyAjjk29wFsRLPvFB3QhdqB2v4M__N16Am8",
  authDomain: "hsrp-saarthi.firebaseapp.com",
  messagingSenderId: "712063525086",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
