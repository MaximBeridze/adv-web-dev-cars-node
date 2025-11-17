import Car from '../models/Car.js'

// Get all cars
export const getAllCars = () => {
	return Car.findAll()
}

// Get car by ID
export const getCarById = (id) => {
	return Car.findById(id)
}

// Create new car
export const createCar = (carData) => {
	const { make, model, year, color, price } = carData
	
	// Business logic: Check if model already exists
	if (model && Car.modelExists(model)) {
		throw new Error('Car model already exists')
	}
	
	return Car.create({ make, model, year, color, price })
}

// Update car
export const updateCar = (id, carData) => {
	const { make, model, year, color, price } = carData
	
	// Check if car exists
	const existingCar = Car.findById(id)
	if (!existingCar) {
		return null
	}
	
	// Business logic: Check if new email conflicts
	if (model && model !== existingCar.model && Car.modelExists(model, id)) {
		throw new Error('Car model already exists')
	}
	
	return Car.update(id, { make, model, year, color, price })
}

// Delete car
export const deleteCar = (id) => {
	return Car.delete(id)
}

// Additional service methods with business logic
export const getCarByMake = (make) => {
	return Car.findByMake(make)
}

export const getCarByModel = (model) => {
	return Car.findByModel(model)
}

export const getCarByYear = (year) => {
	return Car.findByYear(year)
}

export const getCarByColor = (color) => {
	return Car.findByColor(color)
}

export const getCarByPrice = (price) => {
	return Car.findByPrice(price)
}

export const getCarCount = () => {
	return Car.count()
}