import { initializeApp } from "firebase/app";
import { getFirestore , collection } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: import.meta.env.VITE_authDomain,
  projectId: import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const dataCollection = collection(db,"users-personal-details")
export const storage = getStorage(app);