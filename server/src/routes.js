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
import getWeatherTemperature from "./getWeatherTemperature.js"

/**
 * @typedef {object} PoolTemperature
 * @property {string} pool
 * @property {number | undefined} temperature
 */

/**
 * @typedef {object} Response
 * @property {number} weatherTemperature
 * @property {PoolTemperature[]} poolTemperatures
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

      const weatherTemperature = await getWeatherTemperature()

      /** @type {Response} */
      const temperatures = {
        poolTemperatures: tweetsTemperatures,
        weatherTemperature,
      }

      res.json(temperatures)
      setCachedTemperatures(temperatures)
    } catch (error) {
      next(error)
    }
  }
})

export default router
