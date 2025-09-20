// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {
  getAuth,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDwueiKSRfcCwXLC_HxH-WrOoP3N-Wb0N0",
  authDomain: "codenection2025-19a07.firebaseapp.com",
  projectId: "codenection2025-19a07",
  storageBucket: "codenection2025-19a07.appspot.com",
  messagingSenderId: "177603922659",
  appId: "1:177603922659:web:8c40613dfd94f7a112d3d6",
  measurementId: "G-CL9FMHWK6D",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signUpWithEmailAndPassword = async (email, password, name,  phoneNumber) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userData = {
      email: user.email,
      name: name,
      phoneNumber: phoneNumber
    };
    
    await setDoc(doc(db, "users", user.uid), userData);

    return userCredential;

  } catch (error) {
    console.error("Error signing up:", error);
    // Re-throw the error so it can be caught and handled by the calling function
    throw error;
  }
};


function showMessage(message, divId){
    var messageDiv=document.getElementById(divId);
    if (messageDiv) {
        messageDiv.style.display="block";
        messageDiv.innerHTML=message;
        messageDiv.style.opacity=1;
        setTimeout(function() {
            messageDiv.style.opacity=0;
            setTimeout(() => { messageDiv.style.display="none"; }, 500);
        },5000);
    } else {
        console.error(`Element with id "${divId}" not found for showMessage.`);
    }
}

// Export auth for the NextAuth backend and other functions for the UI
export { auth, db, signUpWithEmailAndPassword, showMessage };
