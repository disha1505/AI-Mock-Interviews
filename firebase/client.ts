import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCIwT-YBOz-tndRsU3wBroqt7z2A_p-xhg",
  authDomain: "prepwise-3d397.firebaseapp.com",
  projectId: "prepwise-3d397",
  storageBucket: "prepwise-3d397.firebasestorage.app",
  messagingSenderId: "445968549400",
  appId: "1:445968549400:web:9ae358d0d503921041a56d",
  measurementId: "G-HBPZG0P9NH"
};

// Initialize Firebase
const app =!getApps.length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);