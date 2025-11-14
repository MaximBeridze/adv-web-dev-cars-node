import express from "express"
import config from "./config/config.js"
import { logMiddleware } from "./middleware/logger.js"
import { validateApiKeyProduction } from "./middleware/apiKey.js"
import carRoutes from "./routes/carRoutes.js"
import { initializeDatabase } from "./config/database.js"

const app = express()

// Initialize SQLite DB
initializeDatabase()
	.then(() => console.log("✅ Database Ready"))
	.catch((err) => {
		console.error("❌ Database Init Failed:", err)
		process.exit(1)
	})


// Global Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logMiddleware)

// Public homepage
app.get("/", (req, res) => {
	res.json({
		message: "Welcome to the Cars API 🚗",
		version: "1.0.0",
		environment: config.nodeEnv,
		endpoints: {
			cars: "/cars"
		}
	})
})

// Health check (useful for Render)
app.get("/health", (req, res) => {
	res.json({
		status: "OK",
		timestamp: new Date().toISOString(),
		environment: config.nodeEnv
	})
})

// **Cars Routes** (Protected in production, open in development)
app.use("/cars", validateApiKeyProduction, carRoutes)

// 404 Handler
app.use((req, res) => {
	res.status(404).json({
		error: "Not Found",
		message: `Route ${req.method} ${req.path} not found`
	})
})

// Error Handler
app.use((err, req, res, next) => {
	console.error("Error:", err)
	res.status(err.status || 500).json({
		error: err.message || "Internal Server Error",
		...(config.isDevelopment() && { stack: err.stack })
	})
})

// Start Server
app.listen(config.port, () => {
	console.log(`✅ Server running at http://localhost:${config.port}`)
	console.log(`📊 Environment: ${config.nodeEnv}`)
	console.log(`🔒 API Key Protection: ${config.isProduction() ? "ENABLED" : "DISABLED (Dev Mode)"}`)
	console.log("\nAPI Endpoints:")
	console.log(`  GET    /cars          - List all cars`)
	console.log(`  GET    /cars/:id      - Get one car`)
	console.log(`  POST   /cars          - Add a new car`)
	console.log(`  PATCH  /cars/:id      - Update an existing car`)
	console.log(`  DELETE /cars/:id      - Remove a car`)
})

export default app
