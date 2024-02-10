import { MemoryDB } from "src/core/support/memoryDB";

const db = new MemoryDB("session");
db.connect();

export const getSession = async () => {
  return db.get();
};

export const setSession = async (payload) => {
  return db.set(payload);
};
