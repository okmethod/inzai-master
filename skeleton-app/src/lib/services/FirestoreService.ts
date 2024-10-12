import type { WithFieldValue, DocumentData } from "firebase/firestore";
import type { WhereFilterOp, QuerySnapshot } from "firebase/firestore";
import {
  getFirestore,
  doc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  connectFirestoreEmulator,
} from "firebase/firestore";
import firebaseApp from "$lib/services/firebaseApp";

const isDevelopment = (import.meta.env.MODE as string) === "development";

class FirestoreService {
  private db;
  private collectionName: string;
  protected collectionRef;

  constructor(collectionName: string) {
    this.db = getFirestore(firebaseApp);
    if (isDevelopment) {
      connectFirestoreEmulator(this.db, "localhost", 8010);
    }
    this.collectionName = collectionName;
    this.collectionRef = collection(this.db, this.collectionName);
  }

  protected handleError(message: string, key: string | null, error: unknown): void {
    const keyMessage = key ? ` key=${key}` : "";
    if (error instanceof Error) {
      console.error(`${message}${keyMessage}: ${error.message}`);
    } else {
      console.error(`${message}${keyMessage}: `, error);
    }
  }

  public async add<T extends WithFieldValue<DocumentData>>(data: T): Promise<void> {
    try {
      const docRef = await addDoc(this.collectionRef, data);
      console.debug(`Added with id=${docRef.id}`);
    } catch (error) {
      this.handleError("Failed to save", null, error);
    }
  }

  public async get<T>(id: string): Promise<T | null> {
    try {
      const docRef = doc(this.collectionRef, id);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        return docSnapshot.data() as T;
      } else {
        return null;
      }
    } catch (error) {
      this.handleError("Failed to get", id, error);
      return null;
    }
  }

  public async list<T>(): Promise<T[]> {
    try {
      const querySnapshot = await getDocs(this.collectionRef);
      const docs = querySnapshot.docs.map((doc) => doc.data() as T);
      return docs;
    } catch (error) {
      this.handleError("Failed to get", null, error);
      return [];
    }
  }

  public async update<T>(id: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = doc(this.collectionRef, id);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        await updateDoc(docRef, data);
        console.debug(`Updated with id=${id}`);
      } else {
        console.debug(`No documents found with id=${id}`);
      }
    } catch (error) {
      this.handleError("Failed to update", id, error);
    }
  }
  protected async query(field: string, operator: WhereFilterOp, value: string): Promise<QuerySnapshot | null> {
    try {
      const q = query(this.collectionRef, where(field, operator, value));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return querySnapshot;
      } else {
        return null;
      }
    } catch (error) {
      this.handleError(`Failed to query by ${field}`, value, error);
      return null;
    }
  }
}

export default FirestoreService;
