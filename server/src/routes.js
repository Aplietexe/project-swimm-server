import { Router } from "express"

import {
  getCachedTemperatures,
  setCachedTemperatures,
} from "./cachedTemperatures.js"
import { getTemperature, getTweetsByPool } from "./twitter/index.js"
import getWbt from "./wbt.js"

const router = Router()

router.get("/temperatures", async (_, res) => {
  const cachedTemperatures = getCachedTemperatures()

  if (cachedTemperatures) res.json(cachedTemperatures)
  else {
    const tweetsByPool = await getTweetsByPool()
    const temperatures = tweetsByPool.map(({ pool, tweets }) => ({
      pool,
      temperature: getTemperature(tweets) ?? getWbt(),
    }))

    res.json(temperatures)
    setCachedTemperatures(temperatures)
  }
})

export default router
