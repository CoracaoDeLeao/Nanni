import { FieldValue } from "firebase/firestore";

// Tipo para os objetos de versão (principal e demo)
export type GameVersion = {
  nomeArquivo: string;
  tamanho: number;
  versao: string;
  eDemo: boolean;
  data: Date;
};

// Tipo principal do documento do jogo
export type GameDoc = {
  nome: string;
  banner: string;
  icone: string;
  galeria: Array<{ url: string }>;
  statusDev: string;
  classificacaoIndicativa: string;
  sobre: string;
  traducaoTexto: string[];
  traducaoAudio: string[];
  contSensivel: string[];
  generos: string[];
  tags: string[];
  plataforma: string;
  versoes: GameVersion[];
  preco: number;
  data: FieldValue;
}