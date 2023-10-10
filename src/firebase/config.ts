import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyDBHGocNYdnhISZNzi4XBndtjzGL7hqO88",
    authDomain: "supple-century-363201.firebaseapp.com",
    projectId: "supple-century-363201",
    storageBucket: "supple-century-363201.appspot.com",
    messagingSenderId: "577757506042",
    appId: "1:577757506042:web:a4c372771fab8428f31c43",
    measurementId: "G-H39HC8XGG1"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)