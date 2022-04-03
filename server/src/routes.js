import { Router } from "express"

import { getTemperature, getTweetsByPool } from "./twitter/index.js"
import getWbt from "./wbt.js"

const router = Router()

router.get("/temperatures", async (_, res) => {
  const tweetsByPool = await getTweetsByPool()
  const temperatures = tweetsByPool.map(({ pool, tweets }) => ({
    pool,
    temperature: getTemperature(tweets) ?? getWbt(),
  }))

  res.json(temperatures)
})

export default router
