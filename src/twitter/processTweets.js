import { wordsToNumbers } from "words-to-numbers"

/**
 * @typedef {import("twit").Twitter.Status} Status
 */

/**
 * Remove emojis and turn multiple whitespace characters into a single space.
 *
 * @param {string} toFilter
 * @return {string}
 */
const filterCharacters = (toFilter) =>
  toFilter
    .replace(
      /[\u2011-\u27BF\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD10-\uDDFF]/gu,
      "",
    )
    .replace(/\s{2,}/gu, " ")

/**
 * Filter, format and extract the tweet's text.
 *
 * Filtering:
 * - Only tweets with text
 * - Only tweets from the current day
 *
 * Processing:
 * - Filter characters in the text
 * - Turn numbers expressed in words into numbers
 *
 * Returns and array containing each tweet's text.
 *
 * @param {Status[]} tweets
 * @returns {string[]}
 */
const processTweets = (tweets) => {
  const lastMidnight = new Date().setHours(0, 0, 0, 0)

  const processed = []

  for (const tweet of tweets) {
    // Twit doesn't guarantee that the tweet has a full_text property
    if (!tweet.full_text) continue

    // Stop looping if the current tweet is too old
    if (Date.parse(tweet.created_at) < lastMidnight) break

    // Filter characters in the text
    const filtered = filterCharacters(tweet.full_text)

    // Turn numbers expressed in words into numbers
    const converted = wordsToNumbers(filtered)

    // If word-to-number conversion worked, push the result to the return array,
    // push only the filtered text otherwise.
    processed.push(typeof converted === "string" ? converted : filtered)
  }

  return processed
}

/**
 * Processes all the passed tweets using processTweets
 *
 * @param {{pool: string, tweets: Status[]}[]} tweetsByPool
 * @return {{pool: string, tweetsText: string[]}[]}
 */
const processTweetsByPool = (tweetsByPool) =>
  tweetsByPool.map(({ pool, tweets }) => ({
    pool,
    tweetsText: processTweets(tweets),
  }))

export default processTweetsByPool
