import { getFirestore, Firestore, connectFirestoreEmulator } from "firebase/firestore";
import FirebaseAppSingleton from "$lib/services/FirebaseAppSingleton";

const isDevelopment = (import.meta.env.MODE as string) === "development";

class FirestoreSingleton {
  private static instance: Firestore | null = null;

  // Singleton pattern
  private constructor() {}

  public static getInstance(): Firestore {
    if (!FirestoreSingleton.instance) {
      const firebaseApp = FirebaseAppSingleton;
      const db = getFirestore(firebaseApp);
      if (isDevelopment) {
        connectFirestoreEmulator(db, "localhost", 8010);
      }
      FirestoreSingleton.instance = db;
    }
    return FirestoreSingleton.instance;
  }
}

export default FirestoreSingleton.getInstance();
