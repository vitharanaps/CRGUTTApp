import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {

  apiKey: "AIzaSyAlcthFQV6iFpS-DKsK5vSE2qpCJuCZ6_E",
  authDomain: "railwayapp-c9ea0.firebaseapp.com",
  projectId: "railwayapp-c9ea0",
  storageBucket: "railwayapp-c9ea0.appspot.com",
  messagingSenderId: "949461935680",
  appId: "1:949461935680:web:96f406d9336032288ee1a5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const db = getFirestore(app);
export const storage = getStorage(app);

