import { MemoryDB } from "src/core/support/memoryDB";

const db = new MemoryDB("app");
db.connect();

export const getApp = async () => {
  return db.get();
};

export const setApp = async (payload) => {
  return db.set(payload);
};
