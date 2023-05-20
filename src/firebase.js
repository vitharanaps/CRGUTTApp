import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyAMy4XTsYNgffUOT-P2JsOqN3ZjvD6nqWw",
  authDomain: "crgu-tt-app-1.firebaseapp.com",
  projectId: "crgu-tt-app-1",
  storageBucket: "crgu-tt-app-1.appspot.com",
  messagingSenderId: "205251171569",
  appId: "1:205251171569:web:1a0baa9632e4a2c1158550"
};
const app = initializeApp(firebaseConfig);
export const auth= getAuth();
export const db = getFirestore(app)
export const storage = getStorage(app);
