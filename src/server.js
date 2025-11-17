import express from "express"
import config from "./config/config.js"  // Import config
import { logMiddleware } from "./middleware/logger.js"
import { validateApiKey, validateApiKeyProduction } from "./middleware/apiKey.js"  // Import API key middleware
import carRoutes from "./routes/carRoutes.js"
import { initializeDatabase } from "./config/database.js"
import cors from "cors";


const app = express()

// Initialize database before starting server
await initializeDatabase()

// Global middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logMiddleware)
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "x-api-key"]
}));

// Public routes (no API key needed)
app.get('/', (req, res) => {
	res.json({ 
		message: "Welcome to the API",
		version: "1.0.0",
		environment: config.nodeEnv,
		endpoints: {
			cars: "/cars"
		}
	})
})

// Health check (useful for Render)
app.get('/health', (req, res) => {
	res.json({ 
		status: 'OK',
		timestamp: new Date().toISOString(),
		environment: config.nodeEnv
	})
})

app.use('/cars', validateApiKeyProduction, carRoutes)

// 404 handler
app.use((req, res) => {
	res.status(404).json({ 
		error: 'Not Found',
		message: `Route ${req.method} ${req.path} not found` 
	})
})

// Error handler
app.use((err, req, res, next) => {
	console.error('Error:', err)
	res.status(err.status || 500).json({
		error: err.message || 'Internal Server Error',
		...(config.isDevelopment() && { stack: err.stack })
	})
})

// Start server
app.listen(config.port, () => {
	console.log(`✅ Server running on http://localhost:${config.port}`)
	console.log(`📊 Environment: ${config.nodeEnv}`)
	console.log(`🔒 API Key protection: ${config.apiKey ? 'ENABLED' : 'DISABLED'}`)
	console.log(`\nAPI Endpoints:`)
	console.log(`  GET    /              - Welcome message (public)`)
	console.log(`  GET    /health        - Health check (public)`)
	console.log(`  GET    /cars         - Get all cars (protected)`)
	console.log(`  GET    /cars/:id     - Get car by ID (protected)`)
	console.log(`  POST   /cars         - Create new car (protected)`)
	console.log(`  PUT    /cars/:id     - Update car (protected)`)
	console.log(`  DELETE /cars/:id     - Delete car (protected)`)
})

export default app