// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";


// const firebaseConfig = {

//   apiKey: process.env.REACT_APP_FIREBASE_KEY,
//   authDomain: "railwayapp-c9ea0.firebaseapp.com",
//   projectId: "railwayapp-c9ea0",
//   storageBucket: "railwayapp-c9ea0.appspot.com",
//   messagingSenderId: "949461935680",
//   appId: "1:949461935680:web:96f406d9336032288ee1a5"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const auth = getAuth()
// export const db = getFirestore(app);
// export const storage = getStorage(app);

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "crgu-tt-app-1.firebaseapp.com",
  projectId: "crgu-tt-app-1",
  storageBucket: "crgu-tt-app-1.appspot.com",
  messagingSenderId: "205251171569",
  appId: "1:205251171569:web:19e0150a60b6dc64158550"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const db = getFirestore(app);
export const storage = getStorage(app);