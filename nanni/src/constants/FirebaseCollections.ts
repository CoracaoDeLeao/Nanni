export const COLLECTIONS = {
  USERS: "usuarios",
} as const;

export type CollectionName = keyof typeof COLLECTIONS;
