import { initializeApp, getApps, type FirebaseApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAPlxqcF4L0bDbUx-bEUdFJVb5QUnReTcs",
  authDomain: "okmethod-master-drill.firebaseapp.com",
  projectId: "okmethod-master-drill",
  storageBucket: "okmethod-master-drill.appspot.com",
  messagingSenderId: "215740177928",
  appId: "1:215740177928:web:6ebdbce8d659ded580fbbd",
  measurementId: "G-7GW4YE5N3T",
};

class FirebaseAppSingleton {
  private static instance: FirebaseApp | null = null;

  // Singleton pattern
  private constructor() {}

  public static getInstance(): FirebaseApp {
    if (!FirebaseAppSingleton.instance) {
      if (!getApps().length) {
        FirebaseAppSingleton.instance = initializeApp(firebaseConfig);
      } else {
        FirebaseAppSingleton.instance = getApps()[0];
      }
    }
    return FirebaseAppSingleton.instance;
  }
}

export default FirebaseAppSingleton.getInstance();
