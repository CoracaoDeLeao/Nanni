export const COLLECTIONS = {
  USERS: "usuarios",
  JOGOS: "jogos",
  AVALIACOES: "avaliacoes",
  REPORTES: "reportes",
} as const;

export type CollectionName = keyof typeof COLLECTIONS;
