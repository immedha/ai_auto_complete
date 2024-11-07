// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAymnb3FkcFT2K1N6v_xS29dq5zI_Y46iU",
//   authDomain: "ai-auto-complete-a3a36.firebaseapp.com",
//   projectId: "ai-auto-complete-a3a36",
//   storageBucket: "ai-auto-complete-a3a36.firebasestorage.app",
//   messagingSenderId: "29226922038",
//   appId: "1:29226922038:web:e7a7b73759f03ccfdf6897"
// };

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export function getCreatedApp() {
  return app;
}