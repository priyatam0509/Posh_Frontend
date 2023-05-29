
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyDMgv4FFbsvhm2F2H3Gx8XJpxJ570ZHZ7g",
  authDomain: "posh-healthclub.firebaseapp.com",
  projectId: "posh-healthclub",
  storageBucket: "posh-healthclub.appspot.com",
  messagingSenderId: "777892318220",
  appId: "1:777892318220:web:4cd7e785c8fb1cdb6eb229",
  measurementId: "G-HZTQNTNS84"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);

