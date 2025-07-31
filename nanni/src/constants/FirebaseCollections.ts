export const COLLECTIONS = {
  USERS: "usuarios",
  LISTA_DESEJOS: "listaDesejos",
  JOGOS: "jogos",
  AVALIACOES: "avaliacoes",
  REPORTES: "reportes",
} as const;

export type CollectionName = keyof typeof COLLECTIONS;
