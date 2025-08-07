export const COLLECTIONS = {
  USERS: "usuarios",
  LISTA_DESEJOS: "listaDesejos",
  JOGOS: "jogos",
  SUB_REPORTES: "reportes",
  VENDAS: "vendas",
  AVALIACOES: "avaliacoes",
} as const;

export type CollectionName = keyof typeof COLLECTIONS;
