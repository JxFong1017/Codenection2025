import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration pulled from your existing file
const firebaseConfig = {
    apiKey: "AIzaSyDwueiKSRfcCwXLC_HxH-WrOoP3N-Wb0N0",
    authDomain: "codenection2025-19a07.firebaseapp.com",
    projectId: "codenection2025-19a07",
    storageBucket: "codenection2025-19a07.appspot.com",
    messagingSenderId: "177603922659",
    appId: "1:177603922659:web:8c40613dfd94f7a112d3d6",
    measurementId: "G-CL9FMHWK6D",
};

// Initialize Firebase for SSR and SSG, prevent re-initialization on hot reloads
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

const signUpWithEmailAndPassword = async (email, password, name, phone) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  await setDoc(doc(db, "users", user.uid), {
    name,
    phone,
    email
  });
  return userCredential;
};

const showMessage = (message, elementId) => {
  const messageDiv = document.getElementById(elementId);
  if (messageDiv) {
    messageDiv.innerText = message;
    messageDiv.style.display = 'block';
    setTimeout(() => {
      messageDiv.style.display = 'none';
    }, 3000);
  }
};


export { app, db, auth, signUpWithEmailAndPassword, showMessage };