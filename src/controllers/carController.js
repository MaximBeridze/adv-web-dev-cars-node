import * as carService from '../services/carService.js'

// Get all cars
export const getAllCars = (req, res) => {
	try {
		const cars = carService.getAllCars()
		res.status(200).json(cars)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

// Get single car by ID
export const getCarById = (req, res) => {
	try {
		const { id } = req.params
		const car = carService.getCarById(id)
		
		if (!car) {
			return res.status(404).json({ message: "Car not found" })
		}
		
		res.status(200).json(car)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

// Create new car
export const createCar = (req, res) => {
	try {
		const { make, model, year, color, price } = req.body
		
		// Validation
		if (!make) {
			return res.status(400).json({ message: "Make is required" })
		}
		if (!model) {
			return res.status(400).json({ message: "Model is required" })
		}
		if (!year) {
			return res.status(400).json({ message: "Year is required" })
		}
		if (!color) {
			return res.status(400).json({ message: "Color is required" })
		}
		if (!price) {
			return res.status(400).json({ message: "Price is required" })
		}

		
		const newCar = carService.createCar({ make, model, year, color, price })
		res.status(201).json(newCar)
	} catch (error) {
		// Handle duplicate email error
		if (error.message === 'Car model already exists') {
			return res.status(409).json({ message: error.message })
		}
		res.status(500).json({ message: error.message })
	}
}

// Update car
export const updateCar = (req, res) => {
	try {
		const { id } = req.params
		const { make, model, year, color, price } = req.body
		
		const updatedCar = carService.updateCar(id, { make, model, year, color, price })
		
		if (!updatedCar) {
			return res.status(404).json({ message: "Car not found" })
		}
		
		res.status(200).json(updatedCar)
	} catch (error) {
		if (error.message === 'Car already exists') {
			return res.status(409).json({ message: error.message })
		}
		res.status(500).json({ message: error.message })
	}
}

// Delete car
export const deleteCar = (req, res) => {
	try {
		const { id } = req.params
		const deleted = carService.deleteCar(id)
		
		if (!deleted) {
			return res.status(404).json({ message: "Car not found" })
		}
		
		res.status(204).send()
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}