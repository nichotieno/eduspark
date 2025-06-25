import sqlite3 from 'sqlite3';
import { open, type Database } from 'sqlite';

// This is a singleton to ensure we only have one database connection.
let db: Database | null = null;

export async function getDb() {
  if (!db) {
    // verbose provides more detailed stack traces in case of errors
    const sqlite3Db = new sqlite3.Database('./local.db', sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        console.error("Failed to open the database", err.message);
        console.log("Did you forget to run `npm run db:seed`?");
      }
    });

    db = await open({
      filename: './local.db',
      driver: sqlite3.Database
    });
  }
  return db;
}
