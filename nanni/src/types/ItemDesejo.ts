import { DocumentReference, Timestamp } from "firebase/firestore";

export type ItemDesejo = {
  id: string;
  jogoRef: DocumentReference;
  dataAdicao: Timestamp;
  jogo: {
    // Informações do jogo
    banner: string;
    nome: string;
    nota_avaliacao: number;
    preco: number;
  };
};
