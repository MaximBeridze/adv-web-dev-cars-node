import { db } from "../config/database.js"

export const getAllCars = async () => {
	return await db.all("SELECT * FROM cars")
}

export const getCarById = async (id) => {
	return await db.get("SELECT * FROM cars WHERE id = ?", [id])
}

export const createCar = async (carData) => {
	const { make, model, year, color, price } = carData
	const result = await db.run(
		"INSERT INTO cars (make, model, year, color, price) VALUES (?, ?, ?, ?, ?)",
		[make, model, year, color, price]
	)
	return { id: result.lastID, ...carData }
}

export const updateCar = async (id, carData) => {
	const { make, model, year, color, price } = carData
	await db.run(
		"UPDATE cars SET make = ?, model = ?, year = ?, color = ?, price = ? WHERE id = ?",
		[make, model, year, color, price, id]
	)
	return getCarById(id)
}

export const deleteCar = async (id) => {
	const result = await db.run("DELETE FROM cars WHERE id = ?", [id])
	return result.changes > 0
}
