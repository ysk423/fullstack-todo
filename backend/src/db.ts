import { DatabaseSync } from 'node:sqlite';

let db: DatabaseSync;

export function getDb(): DatabaseSync {
  if (!db) {
    const path = process.env.DB_PATH ?? ':memory:';
    db = new DatabaseSync(path);
    db.exec(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0
      )
    `);
  }
  return db;
}

export function resetDb(): void {
  if (db) {
    db.close();
    db = undefined as unknown as DatabaseSync;
  }
}
