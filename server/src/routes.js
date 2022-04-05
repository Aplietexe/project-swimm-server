import { Router } from "express"

import {
  getCachedTemperatures,
  setCachedTemperatures,
} from "./cachedTemperatures.js"
import {
  getTemperatures,
  getTweetsByPool,
  processTweetsByPool,
} from "./twitter/index.js"
import addWbt from "./addWbt.js"

const router = Router()

router.get("/temperatures", async (_, res) => {
  const cachedTemperatures = getCachedTemperatures()

  if (cachedTemperatures) res.json(cachedTemperatures)
  else {
    const tweetsByPool = await getTweetsByPool()

    const tweetsTextsByPool = processTweetsByPool(tweetsByPool)

    const tweetsTemperatures = getTemperatures(tweetsTextsByPool)

    const temperatures = addWbt(tweetsTemperatures)

    res.json(temperatures)
    setCachedTemperatures(temperatures)
  }
})

export default router
