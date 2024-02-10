import { copyObject } from "src/core/support/object.utils";

export class MemoryDB<T> {
  name: string;

  private _storage = localStorage;
  private _table: T;

  get table() {
    const columns = this._table || {};

    return copyObject(columns);
  }

  constructor(name) {
    this.name = name;
  }

  async reset() {
    this._table = null;

    this.save();
  }

  async connect(): Promise<boolean> {
    const record = this._storage.getItem(this.name);

    try {
      this._table = record ? JSON.parse(record) || {} : {};
    } catch (err) {
      return false;
    }

    return true;
  }

  async get(): Promise<T> {
    return this.table;
  }

  async set(record: Object): Promise<T> {
    const current = this.table;
    const columns = Object.assign(current, record);

    this._table = columns;

    await this.save();

    return this.get();
  }

  async save(): Promise<boolean> {
    this._storage.setItem(this.name, JSON.stringify(this.table));

    return true;
  }
}
