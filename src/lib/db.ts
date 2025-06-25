import sqlite3 from 'sqlite3';
import { open, type Database } from 'sqlite';

// This is a singleton to ensure we only have one database connection.
let db: Database | null = null;

export async function getDb() {
  if (!db) {
    // The `open` function from the `sqlite` package will create the database file if it does not exist,
    // when the appropriate flags are passed. The library defaults to creating the file if it doesn't exist.
    try {
      db = await open({
        filename: './local.db',
        driver: sqlite3.Database
      });
    } catch (error) {
       console.error("Failed to open the database", error);
       console.log("Did you forget to run `npm run db:seed`? The database might not have been created yet.");
       throw new Error("Failed to connect to the database.");
    }
  }
  return db;
}
