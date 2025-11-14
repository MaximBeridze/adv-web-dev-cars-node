import sqlite3 from "sqlite3"
import { open } from "sqlite"

export let db

export const initializeDatabase = async () => {
	db = await open({
		filename: process.env.DATABASE_URL || "./database.sqlite",
		driver: sqlite3.Database
	})

	await db.exec(`
		CREATE TABLE IF NOT EXISTS cars (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			make TEXT NOT NULL,
			model TEXT NOT NULL,
			year INTEGER NOT NULL,
			color TEXT,
			price REAL
		);
	`)

	console.log("✅ Database initialized and cars table is ready")
}
