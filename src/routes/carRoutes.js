import express from "express"
import { logMiddleware } from "../middleware/logger.js"
import * as carController from "../controllers/carController.js"

// Create a router instance
const router = express.Router()

// Define routes - notice we use router instead of app
// The base path will be added when we mount this router in index.js

router.get("/", logMiddleware, carController.getAllCars) // GET /cars
router.get("/:id", carController.getCarById) // GET /cars/:id
router.post("/", carController.createCar) // POST /cars
router.put("/:id", carController.updateCar) // PUT /Cars/:id
router.delete("/:id", carController.deleteCar) // DELETE /cars/:id

// Export the router
export default router