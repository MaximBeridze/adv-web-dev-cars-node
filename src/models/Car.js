import db from '../config/database.js'

// Define the car model
class Car {
	// Table schema definition
	static tableName = 'cars'
	
	// Create the cars table
	static createTable() {
		const sql = `
			CREATE TABLE IF NOT EXISTS ${this.tableName} (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				make TEXT NOT NULL,
				model TEXT UNIQUE,
				year INTEGER,
				color TEXT,
				price REAL,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
			)
		`
		db.exec(sql)
		console.log(`✅ Table '${this.tableName}' created/verified`)
	}
	
	// Get all cars
	static findAll() {
		const stmt = db.prepare(`SELECT * FROM ${this.tableName} ORDER BY id`)
		return stmt.all()
	}
	
	// Find car by ID
	static findById(id) {
		const stmt = db.prepare(`SELECT * FROM ${this.tableName} WHERE id = ?`)
		return stmt.get(id)
	}

	// Find car by model
	static findByModel(model) {
		const stmt = db.prepare(`SELECT * FROM ${this.tableName} WHERE model = ?`)
		return stmt.get(model)
	}
	
	// Find car by make
	static findByMake(make) {
		const stmt = db.prepare(`SELECT * FROM ${this.tableName} WHERE make = ?`)
		return stmt.get(make)
	}

		// Find car by year
	static findByYear(year) {
		const stmt = db.prepare(`SELECT * FROM ${this.tableName} WHERE year = ?`)
		return stmt.get(year)
	}

		// Find car by color
	static findByColor(color) {
		const stmt = db.prepare(`SELECT * FROM ${this.tableName} WHERE color = ?`)
		return stmt.get(color)
	}

		// Find car by price
	static findByPrice(price) {
		const stmt = db.prepare(`SELECT * FROM ${this.tableName} WHERE price = ?`)
		return stmt.get(price)
	}
	
	// Create new car
	static create(carData) {
		const { make, model, year, color, price } = carData
		const stmt = db.prepare(`
			INSERT INTO ${this.tableName} (make, model, year, color, price) 
			VALUES (?, ?, ?, ?, ?)
		`)
		const result = stmt.run( make, model, year, color, price || null)
		return this.findById(result.lastInsertRowid)
	}
	
	// Update car
	static update(id, carData) {
		const { make, model, year, color, price } = carData
		
		// Build dynamic update query based on provided fields
		const updates = []
		const values = []
		
		if (make !== undefined) {
			updates.push('make = ?')
			values.push(make)
		}
		
		if (model !== undefined) {
			updates.push('model = ?')
			values.push(model)
		}
		
		if (year !== undefined) {
			updates.push('year = ?')
			values.push(year)
		}
		
		if (color !== undefined) {
			updates.push('color = ?')
			values.push(color)
		}
		
		if (price !== undefined) {
			updates.push('price = ?')
			values.push(price)
		}	

		// Always update the updated_at timestamp
		updates.push('updated_at = CURRENT_TIMESTAMP')
		
		if (updates.length === 1) {
			// Only timestamp update, nothing to change
			return this.findById(id)
		}
		
		values.push(id)
		
		const stmt = db.prepare(`
			UPDATE ${this.tableName} 
			SET ${updates.join(', ')} 
			WHERE id = ?
		`)
		
		stmt.run(...values)
		return this.findById(id)
	}
	
	// Delete car
	static delete(id) {
		const stmt = db.prepare(`DELETE FROM ${this.tableName} WHERE id = ?`)
		const result = stmt.run(id)
		return result.changes > 0
	}
	
	// Check if model exists (excluding a specific car ID)
	static modelExists(model, excludeId = null) {
		let stmt
		if (excludeId) {
			stmt = db.prepare(`SELECT id FROM ${this.tableName} WHERE model = ? AND id != ?`)
			return stmt.get(model, excludeId) !== undefined
		} else {
			stmt = db.prepare(`SELECT id FROM ${this.tableName} WHERE model = ?`)
			return stmt.get(model) !== undefined
		}
	}
	
	// Count total cars
	static count() {
		const stmt = db.prepare(`SELECT COUNT(*) as count FROM ${this.tableName}`)
		return stmt.get().count
	}
	
	// Seed sample data
	static seed() {
		const count = this.count()
		
		if (count === 0) {
			console.log('📝 Seeding cars table...')
			
		const cars = [
			{ make: "Toyota", model: "Corolla", year: 2018, color: "White", price: 15000 },
			{ make: "Honda", model: "Civic", year: 2020, color: "Black", price: 18000 },
			{ make: "Ford", model: "Mustang", year: 2019, color: "Red", price: 32000 },
			{ make: "Chevrolet", model: "Camaro", year: 2021, color: "Yellow", price: 35000 },
			{ make: "BMW", model: "M3", year: 2017, color: "Blue", price: 42000 },
			{ make: "Mercedes", model: "C63", year: 2019, color: "Gray", price: 48000 },
			{ make: "Audi", model: "A4", year: 2020, color: "Silver", price: 30000 },
			{ make: "Volkswagen", model: "Golf", year: 2016, color: "Green", price: 12000 },
			{ make: "Porsche", model: "911", year: 2018, color: "Red", price: 90000 },
			{ make: "Nissan", model: "GT-R", year: 2015, color: "Black", price: 85000 },
			{ make: "Hyundai", model: "Elantra", year: 2021, color: "White", price: 17000 },
			{ make: "Kia", model: "Stinger", year: 2019, color: "Blue", price: 28000 },
			{ make: "Subaru", model: "WRX", year: 2018, color: "Blue", price: 26000 },
			{ make: "Lexus", model: "IS300", year: 2020, color: "Gray", price: 35000 },
			{ make: "Jaguar", model: "F-Type", year: 2017, color: "Orange", price: 55000 }
		];
			
			cars.forEach(car => this.create(car))
			console.log(`✅ Seeded ${cars.length} cars`)
		}
	}
}

export default Car