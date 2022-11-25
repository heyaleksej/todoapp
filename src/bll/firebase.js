// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

const firebaseConfig = {
    apiKey: "AIzaSyALUmsQZl5Foz7RQNNj7_4zuIvHU_gafgE",
    authDomain: "todo-672d1.firebaseapp.com",
    projectId: "todo-672d1",
    storageBucket: "todo-672d1.appspot.com",
    messagingSenderId: "225168015067",
    appId: "1:225168015067:web:353abbe498e8b4b5f3d6fe"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);





