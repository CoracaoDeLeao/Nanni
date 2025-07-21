export const COLLECTIONS = {
  USERS: "usuarios",
  JOGOS: "jogos",
  SUB_REPORTES: "reportes",
  VENDAS: "vendas",
} as const;

export type CollectionName = keyof typeof COLLECTIONS;
