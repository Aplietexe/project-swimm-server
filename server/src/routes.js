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
  // If the cached information is still valid, respond with that.
  const cachedTemperatures = getCachedTemperatures()

  if (cachedTemperatures) res.json(cachedTemperatures)
  else {
    // Wrap the process in a try-catch block to handle any errors
    try {
      // Get the tweets from each pool
      const tweetsByPool = await getTweetsByPool()

      // Process tweets to ease the process of extracting the temperatures
      const tweetsTextsByPool = processTweetsByPool(tweetsByPool)

      // Extract the temperatures for each pool using the tweets content
      const tweetsTemperatures = getTemperatures(tweetsTextsByPool)

      // Get the weather data
      const weatherTemperature = await getWeatherTemperature()

      // Send back the temperatures and weather
      /** @type {Response} */
      const temperatures = {
        poolTemperatures: tweetsTemperatures,
        weatherTemperature,
      }

      res.json(temperatures)

      // Save the data to the cache
      setCachedTemperatures(temperatures)
    } catch (error) {
      // Return 500 status, log error to the console and prevent server from
      // crashing using express error handler
      next(error)
    }
  }
})

export default router
