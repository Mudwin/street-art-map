import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyDnytKmRevDFmeqExicLsNGuD6vqlfgyLg",
  authDomain: "street-art-map-2025.firebaseapp.com",
  projectId: "street-art-map-2025",
  storageBucket: "street-art-map-2025.firebasestorage.app",
  messagingSenderId: "847478808166",
  appId: "1:847478808166:web:65c6d2a490dad4238dd7a7",
  measurementId: "G-5GJQQ5C5GG",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
