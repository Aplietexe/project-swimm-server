/**
 * @typedef {import("twit").Twitter.Status} Status
 */

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
 * @param {{pool: string, tweets: Status[]}[]} tweetsByPool
 * @returns {{pool: string, tweetsText: string[]}[]}
 */
const processTweets = (tweetsByPool) =>
  tweetsByPool.map(({ pool, tweets }) => {
    const lastMidnight = new Date().setHours(0, 0, 0, 0)

    const processed = []

    for (const tweet of tweets) {
      // Twit doesn't guarantee that the tweet has a full_text property
      if (!tweet.full_text) continue

      // Stop looping if the current tweet is too old
      if (Date.parse(tweet.created_at) < lastMidnight) break

      processed.push(filterCharacters(tweet.full_text))
    }

    return {
      pool,
      tweetsText: processed,
    }
  })

export default processTweets
