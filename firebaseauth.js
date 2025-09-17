// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDwueiKSRfcCwXLC_HxH-WrOoP3N-Wb0N0",
  authDomain: "codenection2025-19a07.firebaseapp.com",
  projectId: "codenection2025-19a07",
  storageBucket: "codenection2025-19a07.firebasestorage.app",
  messagingSenderId: "177603922659",
  appId: "1:177603922659:web:8c40613dfd94f7a112d3d6",
  measurementId: "G-CL9FMHWK6D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);