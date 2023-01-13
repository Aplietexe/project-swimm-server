/**
 * @typedef {import("twit").Twitter.Status} Status
 */

/**
 * Represents the information extracted from a single Tweet: wheather is has a
 * keyword and all of the potential temperatures in that tweet
 *
 * @typedef {object} TweetMatch
 * @property {boolean} isValued Wheather the tweet contains "degrees" or
 * "temperature" somewhere in its content, even if it's not immediately before
 * or after any of the matches
 * @property {string[]} results An array of all the matches in the tweet
 */

/**
 * @typedef {{isValued: boolean, results: string[]}[]} TweetMatches
 */

// This will match any numbers in the tweet along with keywords around it that
// could suggest that said match is a temperature
const regexp =
  /(?:air\s)?(?:temperature\sis\s)?\d\d?(?:\.\d)?[º°]?C?(?:\sdegrees)?/gu

/**
 * Take an array of strings such as tweets' text and return an array of objects
 * that contain all regex matches in every tweet, along with an isValued boolean
 * that indicates whether that tweet contains "degrees" or "temperature"
 * somewhere in its content, even if it's not immediately before or after any of
 * the matches.
 *
 * @param {string[]} tweetsText
 * @returns {TweetMatches}
 */
const getAllMatches = (tweetsText) =>
  tweetsText.map((tweetText) => {
    // Get all matches in the string
    const tweetMatches = tweetText.matchAll(regexp)

    // Convert iterable into an array and extract the complete match
    const results = Array.from(tweetMatches, (result) => result[0])

    // Determine weather the string contains "degrees" or "temperature" in it
    const isValued =
      tweetText.includes("degrees") || tweetText.includes("temperature")

    return {
      isValued,
      results,
    }
  })

/**
 * Remove any matches that start with "air temperature", as we are looking for
 * water temperature, and return an identical array without those matches.
 *
 * @param {TweetMatches} allMatches
 * @returns {TweetMatches}
 */
const removeAirTemperature = (allMatches) =>
  allMatches.map(({ isValued, results }) => ({
    isValued,
    results: results.filter((result) => !result.startsWith("air temperature")),
  }))

/**
 * Extract all the matches from every tweet and filter them, leaving only
 * those which end with "degrees" or include "temperature is", the ° symbol or a
 * "C" after the number.
 *
 * @param {TweetMatches} allMatches
 * @returns {string[]}
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
 * Extract all the matches from every tweet and filter them, leaving only those
 * which are decimal numbers, and thus are more likely to be a temperature.
 *
 * @param {TweetMatches} allMatches
 * @returns {string[]}
 */
const getFloatMatches = (allMatches) =>
  allMatches.flatMap((match) =>
    match.results.filter((result) => result.includes(".")),
  )

/**
 * Remove anything that's not a number or a dot from the string and parses it as
 * a floating point number.
 *
 * @param {string} match
 * @returns {number}
 */
const parseTemperature = (match) =>
  Number.parseFloat(match.replace(/[^\d.]/gu, ""))

/**
 * Indicate weather the number that is passed is lower or equal to 28.
 *
 * @param {number} temperature
 * @returns {boolean}
 */
const capTemperature = (temperature) => temperature <= 28

/**
 * Take an array of strings such as tweets' text and match any potential
 * temperatures. Then return the one that is most likely to be the actual
 * temperature, considering keywords and their position on the tweet, as well as
 * the type of number (integer or decimal). If no match is likely, return
 * undefined.
 *
 * @param {string[]} tweetsText
 */
const getTemperature = (tweetsText) => {
  // Start with everything that matches the regex and remove matches that are
  // about air temperature
  const allMatches = removeAirTemperature(getAllMatches(tweetsText))

  // Get the best matches, those that have keywords right besides the number
  const bestMatches = getBestMatches(allMatches)

  // Turn the matches into numbers and get the most recent one under the limit
  const bestTemperature = bestMatches.map(parseTemperature).find(capTemperature)

  if (bestTemperature) return bestTemperature

  // If no match satisfies the previous conditions, try to get one which has a
  // keyword somewhere else in the tweet it came from

  // Leave only valued tweets, turn the matches into numbers and get the most
  // recent one under the limit
  const valuedTemperature = allMatches
    .filter((match) => match.isValued)
    .flatMap((match) => match.results.map(parseTemperature))
    .find(capTemperature)

  if (valuedTemperature) return valuedTemperature

  // If no match satisfies the previous conditions, try to get one which is a
  // floating point number

  // Leave only the matches that contain decimal numbers
  const floatMatches = getFloatMatches(allMatches)

  // Turn the matches into numbers and get the most recent one under the limit
  const floatTemperature = floatMatches
    .map(parseTemperature)
    .find(capTemperature)

  if (floatTemperature) return floatTemperature

  // If no match satisfies the previous conditions, return undefined
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
