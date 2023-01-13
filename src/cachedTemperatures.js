/**
 * @typedef {import("./routes").Response} Response
 */

/** @type {{data?: Response, expires: number}} */
const cache = {
  expires: 0,
}

/**
 * Return the cached data if it hasn't expired yet, undefined otherwise.
 *
 * @returns {Response | undefined}
 */
const getCachedTemperatures = () => {
  if (Date.now() < cache.expires) return cache.data

  return undefined
}

/**
 * Save the passed data to the cache and set it to expire after 1 minute.
 *
 * @param {Response} newData
 */
const setCachedTemperatures = (newData) => {
  cache.data = newData
  cache.expires = Date.now() + 60 * 1000
}

export { getCachedTemperatures, setCachedTemperatures }
