import { ItemDesejo } from "@/types/ItemDesejo";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import { COLLECTIONS } from "@/constants/FirebaseCollections";

export async function fetchListaDesejo(
  uid: string,
): Promise<ItemDesejo[] | undefined> {
  try {
    const ref = collection(
      db,
      COLLECTIONS.USERS,
      uid,
      COLLECTIONS.LISTA_DESEJOS,
    );
    const snap = await getDocs(ref);

    return snap.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as ItemDesejo,
    );
  } catch (err) {
    console.error(err);
    return;
  }
}

export async function deleteDesejo(uid: string, id: string): Promise<boolean> {
  try {
    const ref = doc(db, COLLECTIONS.USERS, uid, COLLECTIONS.LISTA_DESEJOS, id);
    await deleteDoc(ref);

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
