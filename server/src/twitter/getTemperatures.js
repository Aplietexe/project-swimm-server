/**
 * @typedef {import("twit").Twitter.Status} Status
 */

/**
 * @typedef {{isValued: boolean, results: string[]}[]} TweetMatches
 */

const regexp =
  /(?:air\s)?(?:temperature\sis\s)?\d\d?(?:\.\d)?[º°]?C?(?:\sdegrees)?/gu

/**
 * @param {string[]} tweetsText
 * @returns {TweetMatches}
 */
const getAllMatches = (tweetsText) =>
  tweetsText.map((tweetText) => {
    const tweetMatches = tweetText.matchAll(regexp)

    const results = Array.from(tweetMatches, (result) => result[0])

    const isValued =
      tweetText.includes("degrees") || tweetText.includes("temperature")

    return {
      isValued,
      results,
    }
  })

/**
 * @param {TweetMatches} allMatches
 * @returns {TweetMatches}
 */
const removeAirTemperature = (allMatches) =>
  allMatches.map(({ isValued, results }) => ({
    isValued,
    results: results.filter((result) => !result.startsWith("air")),
  }))

/**
 * @param {TweetMatches} allMatches
 */
const getBestMatches = (allMatches) =>
  allMatches.flatMap((match) =>
    match.results.filter(
      (result) =>
        result.endsWith("degrees") ||
        result.includes("temperature is") ||
        result.includes("°") ||
        result.includes("C"),
    ),
  )

/**
 * @param {TweetMatches} allMatches
 */
const getFloatMatches = (allMatches) =>
  allMatches.flatMap((match) =>
    match.results.filter((result) => result.includes(".")),
  )

/**
 * @param {string} match
 */
const parseTemperature = (match) =>
  Number.parseFloat(match.replace(/[^\d.]/gu, ""))

/**
 * @param {number} temperature
 */
const capTemperature = (temperature) => temperature <= 28

/**
 * @param {string[]} tweetsText
 */
const getTemperature = (tweetsText) => {
  const allMatches = removeAirTemperature(getAllMatches(tweetsText))

  const bestMatches = getBestMatches(allMatches)

  const bestTemperature = bestMatches.map(parseTemperature).find(capTemperature)

  if (bestTemperature) return bestTemperature

  const floatMatches = getFloatMatches(allMatches)

  const valuedTemperature = allMatches
    .filter((match) => match.isValued)
    .flatMap((match) => match.results.map(parseTemperature))
    .find(capTemperature)

  if (valuedTemperature) return valuedTemperature

  const floatTemperature = floatMatches
    .map(parseTemperature)
    .find(capTemperature)

  if (floatTemperature) return floatTemperature

  return undefined
}

/**
 * @param {{pool: string, tweetsText: string[]}[]} tweetsTextsByPool
 */
const getTemperatures = (tweetsTextsByPool) =>
  tweetsTextsByPool.map(({ pool, tweetsText }) => ({
    pool,
    temperature: getTemperature(tweetsText),
  }))

export default getTemperatures
