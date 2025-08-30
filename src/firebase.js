import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCzgq_OI_7wfOxZ33Ok023yWK5vaVqATqc",
    authDomain: "saesap-firebase.firebaseapp.com",
    projectId: "saesap-firebase",
    storageBucket: "saesap-firebase.firebasestorage.app",
    messagingSenderId: "1062078511891",
    appId: "1:1062078511891:web:7e65b721bb0936a8b038e6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);