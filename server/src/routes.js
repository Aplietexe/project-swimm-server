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
import addWeatherTemperature from "./addWeatherTemperature.js"

/**
 * @typedef {object} Response
 * @property {number} weatherTemperature
 * @property {{pool: string, temperature: number}[]} poolTemperatures
 */

const router = Router()

router.get("/temperatures", async (_, res, next) => {
  const cachedTemperatures = getCachedTemperatures()

  if (cachedTemperatures) res.json(cachedTemperatures)
  else {
    try {
      const tweetsByPool = await getTweetsByPool()

      const tweetsTextsByPool = processTweetsByPool(tweetsByPool)

      const tweetsTemperatures = getTemperatures(tweetsTextsByPool)

      /** @type {Response} */
      const temperatures = await addWeatherTemperature(tweetsTemperatures)

      res.json(temperatures)
      setCachedTemperatures(temperatures)
    } catch (error) {
      next(error)
    }
  }
})

export default router
