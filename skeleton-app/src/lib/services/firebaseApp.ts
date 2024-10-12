// Import the functions you need from the SDKs you need
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAPlxqcF4L0bDbUx-bEUdFJVb5QUnReTcs",
  authDomain: "okmethod-master-drill.firebaseapp.com",
  projectId: "okmethod-master-drill",
  storageBucket: "okmethod-master-drill.appspot.com",
  messagingSenderId: "215740177928",
  appId: "1:215740177928:web:6ebdbce8d659ded580fbbd",
  measurementId: "G-7GW4YE5N3T",
};

// Initialize Firebase
let firebaseApp: FirebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApps()[0];
}

export default firebaseApp;
