import "dotenv/config"
import express from "express"
import cors from "cors"

import apiRoutes from "./routes.js"
import { createTwitClient } from "./twitter/index.js"

const port = process.env.PORT ?? 5000

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/v1", apiRoutes)

app.listen(port, () => {
  createTwitClient()
  console.log(`Server is running on port: ${port}`)
})
