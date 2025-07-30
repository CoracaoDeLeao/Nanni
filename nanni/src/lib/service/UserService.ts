import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/Firebase";
import { COLLECTIONS } from "@/constants/FirebaseCollections";

type FirestoreUserData = {
  cargo?: boolean;
  nome?: string,
  avatar?: string,
  // outros campos que você espera do Firestore
};

export async function fetchUserAdditionalData(uid: string) {
  const docRef = doc(db, COLLECTIONS.USERS, uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  const data = docSnap.data() as FirestoreUserData;

  return {
    isDev: data.cargo || false,
    // > Para Header-perfil
    nome: data.nome || undefined,
    avatar: data.avatar || undefined,
    // adicione outros campos aqui se precisar
  };
}
