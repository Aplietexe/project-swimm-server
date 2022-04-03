/**
 * @typedef {import("twit").Twitter.Status} Status
 */

/**
 * @typedef {{isValued: boolean, results: string[]}[]} TweetMatches
 */

const regexp =
  /(?:air\s)?(?:temperature\sis\s)?\d\d?(?:\.\d)?[º°]?C?(?:\sdegrees)?/gu

/**
 * @param {string} toFilter
 */
const filterCharacters = (toFilter) =>
  toFilter
    .replace(
      /[\u2011-\u27BF\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD10-\uDDFF]/gu,
      "",
    )
    .replace(/\s{2,}/gu, " ")

/**
 * @param {Status[]} tweets
 * @returns {TweetMatches}
 */
const getAllMatches = (tweets) => {
  // const lastMidnight = new Date().setHours(0, 0, 0, 0)

  const allMatches = []

  for (const tweet of tweets) {
    // Stop looping if the current tweet is too old
    // const created = Date.parse(tweet.created_at)

    // if (created < lastMidnight) break

    // Twit doesn't guarantee that the tweet has a full_text property
    if (!tweet.full_text) continue

    // Extract potential temperatures
    const tweetMatches = filterCharacters(tweet.full_text).matchAll(regexp)

    const results = Array.from(tweetMatches, (result) => result[0])

    const isValued =
      tweet.full_text.includes("degrees") ||
      tweet.full_text.includes("temperature")

    const tweetMatch = {
      isValued,
      results,
    }

    allMatches.push(tweetMatch)
  }

  return allMatches
}

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
 * @param {Status[]} tweets
 */
const processTweets = (tweets) => {
  const allMatches = removeAirTemperature(getAllMatches(tweets))

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
 * @param {Status[]} tweets
 */
const getTemperature = (tweets) => {
  const temperature = processTweets(tweets)

  if (temperature) return temperature

  return undefined
}

export default getTemperature
