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
      FirestoreSingleton.instance = db;
    }
    if (isDevelopment) {
      FirestoreSingleton.connectEmulator();
    }
    return FirestoreSingleton.instance;
  }

  private static connectEmulator(): void {
    let host: string;
    let port: number;

    if (typeof window === "undefined") {
      // サーバーサイド
      host = "firestore";
      port = 8000;
    } else {
      // クライアントサイド
      host = "localhost";
      port = 8010;
    }
    if (FirestoreSingleton.instance) {
      console.info("connecting Firestore Emulator...");
      connectFirestoreEmulator(FirestoreSingleton.instance, host, port);
      console.info("connected Firestore Emulator.");
    }
  }
}

export default FirestoreSingleton.getInstance();
