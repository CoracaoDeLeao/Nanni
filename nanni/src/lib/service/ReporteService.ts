import { db } from "@/lib/Firebase";
import { COLLECTIONS } from "@/constants/FirebaseCollections";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

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
      COLLECTIONS.SUB_REPORTES,
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

export const getReportesByJogoID = async (jogoId: string) => {
  try {
    // Referência ao documento do jogo
    const jogoDocRef = doc(db, COLLECTIONS.JOGOS, jogoId);

    // Referência à subcoleção de reportes
    const reportesCollectionRef = collection(
      jogoDocRef,
      COLLECTIONS.SUB_REPORTES,
    );

    // Buscar todos os documentos da subcoleção
    const reportesSnapshot = await getDocs(reportesCollectionRef);

    // 4. Mapear documentos e expandir dados do usuário
    const reportes = await Promise.all(
      reportesSnapshot.docs.map(async (reporteDoc) => {
        const reporteData = reporteDoc.data();

        return {
          id: reporteDoc.id,
          ...reporteData,
        };
      }),
    );

    return {
      success: true,
      reportes,
    };
  } catch (error) {
    console.error("Erro ao buscar reportes:", error);
    return {
      success: false,
      error: "Erro ao carregar reportes",
      reportes: [],
    };
  }
};
