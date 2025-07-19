export const COLLECTIONS = {
  USERS: "usuarios",
  JOGOS: "jogos",
  REPORTES: "reportes",
} as const;

export type CollectionName = keyof typeof COLLECTIONS;
