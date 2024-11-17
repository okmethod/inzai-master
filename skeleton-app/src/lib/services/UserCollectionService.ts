import FirestoreCollectionService from "$lib/services/FirestoreCollectionService";
import type { Auth0UserData } from "$lib/types/auth0";
import type { QuerySnapshot } from "firebase/firestore";

class UserCollectionService extends FirestoreCollectionService {
  constructor(collectionName: string) {
    super(collectionName);
  }

  private async queryBySub(sub: string): Promise<QuerySnapshot | null> {
    const querySnapshot = await this.query("sub", "==", sub);
    return querySnapshot;
  }

  public async listBySub<T extends Auth0UserData>(sub: string): Promise<T[]> {
    const querySnapshot = await this.queryBySub(sub);
    if (querySnapshot !== null) {
      const docs = querySnapshot.docs.map((doc) => doc.data() as T);
      return docs;
    } else {
      return [];
    }
  }

  public async getBySub<T extends Auth0UserData>(sub: string): Promise<T | null> {
    const docs = await this.listBySub<T>(sub);
    return docs.length > 0 ? docs[0] : null;
  }

  public async setBySub<T extends Auth0UserData>(
    sub: string,
    data: Partial<T>,
    createIfNotExist: boolean = false,
  ): Promise<void> {
    const querySnapshot = await this.queryBySub(sub);
    if (querySnapshot !== null) {
      const docId = querySnapshot.docs[0].id;
      await this.update(docId, data);
      console.debug(`Updated with sub=${sub}`);
    } else {
      if (createIfNotExist) {
        await this.add(data);
        console.debug(`Added with sub=${sub}`);
      } else {
        console.debug(`No documents found with sub=${sub}`);
      }
    }
  }
}

export default UserCollectionService;
