import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/Firebase";
import { COLLECTIONS } from "@/constants/FirebaseCollections";

type FirestoreUserData = {
  cargo?: boolean;
  // outros campos que você espera do Firestore
};

export async function fetchUserAdditionalData(uid: string) {
  const docRef = doc(db, COLLECTIONS.USERS, uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  const data = docSnap.data() as FirestoreUserData;

  return {
    isDev: data.cargo || false,
    // adicione outros campos aqui se precisar
  };
}
