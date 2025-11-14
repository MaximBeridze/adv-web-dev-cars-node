import * as carService from "../services/carService.js"

export const getAllCars = async (req, res) => {
	const cars = await carService.getAllCars()
	res.json(cars)
}

export const getCarById = async (req, res) => {
	const car = await carService.getCarById(req.params.id)
	if (!car) return res.status(404).json({ message: "Car not found" })
	res.json(car)
}

export const createCar = async (req, res) => {
	const newCar = await carService.createCar(req.body)
	res.status(201).json(newCar)
}

export const updateCar = async (req, res) => {
	const updatedCar = await carService.updateCar(req.params.id, req.body)
	if (!updatedCar) return res.status(404).json({ message: "Car not found" })
	res.json(updatedCar)
}

export const deleteCar = async (req, res) => {
	const deleted = await carService.deleteCar(req.params.id)
	if (!deleted) return res.status(404).json({ message: "Car not found" })
	res.json({ message: "Car deleted" })
}
