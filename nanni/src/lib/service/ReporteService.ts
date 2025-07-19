import { db } from "@/lib/Firebase";
import { COLLECTIONS } from "@/constants/FirebaseCollections";
import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore";

export const saveReporte = async (
  jogoID: string,
  userID: string,
  reporteData: {
    tipoProblema: string;
    razao: string;
  },
) => {
  try {
    // Referência ao documento pai
    const parentDocRef = doc(db, COLLECTIONS.JOGOS, jogoID);

    // Cria referência ao documento do usuário
    const userRef = doc(db, COLLECTIONS.USERS, userID);

    // Referência à subcoleção dentro do documento pai
    const reportesCollectionRef = collection(
      parentDocRef,
      COLLECTIONS.REPORTES,
    );

    // Adiciona documento com timestamp do servidor
    const docRef = await addDoc(reportesCollectionRef, {
      ...reporteData,
      userRef: userRef,
      data: serverTimestamp(),
    });

    return {
      success: true,
      reportId: docRef.id,
    };
  } catch (error) {
    console.error("Erro ao salvar reporte:", error);
    return {
      success: false,
      error: "Erro ao salvar reporte no banco de dados",
    };
  }
};
