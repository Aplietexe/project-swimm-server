import { Router } from "express"

import {
  getCachedTemperatures,
  setCachedTemperatures,
} from "./cachedTemperatures.js"
import {
  getTemperature,
  getTweetsByPool,
  processTweets,
} from "./twitter/index.js"
import getWbt from "./wbt.js"

const router = Router()

router.get("/temperatures", async (_, res) => {
  const cachedTemperatures = getCachedTemperatures()

  if (cachedTemperatures) res.json(cachedTemperatures)
  else {
    const tweetsByPool = await getTweetsByPool()

    const tweetsTextsByPool = processTweets(tweetsByPool)

    const temperatures = tweetsTextsByPool.map(({ pool, tweetsText }) => ({
      pool,
      temperature: getTemperature(tweetsText) ?? getWbt(),
    }))

    res.json(temperatures)
    setCachedTemperatures(temperatures)
  }
})

export default router
