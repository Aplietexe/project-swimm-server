import "dotenv/config"
import express from "express"
import cors from "cors"

import apiRoutes from "./routes.js"
import { createTwitClient } from "./twitter/index.js"

const port = process.env.PORT ?? 5000

const app = express()

// Only allow request from the same domain
app.use(cors())

// Add the capability to use json
app.use(express.json())

// Prefix all routes with /api/vi
app.use("/api/v1", apiRoutes)

app.listen(port, () => {
  // Create the Twit client as soon as the server starts
  createTwitClient()

  console.log(`Server is running on port: ${port}`)
})
