import { getTwitClient } from "./client.js"
import pools from "./pools.js"

/**
 * @typedef {import("twit").Twitter.Status} Status
 */

/**
 * Retrieve the last 20 tweets from the passed Twitter handle and return them as
 * an array.
 *
 * @param {string} handle
 * @returns {Promise<Status[]>}
 */
const getTweetsFromHandle = async (handle) => {
  const twitClient = getTwitClient()

  /* eslint-disable camelcase */
  /* eslint-disable @typescript-eslint/naming-convention */
  const parameters = {
    count: 20,
    exclude_replies: true,
    include_rts: false,
    screen_name: handle,
    tweet_mode: "extended",
  }
  /* eslint-enable camelcase */
  /* eslint-enable @typescript-eslint/naming-convention */

  const { data } = await twitClient.get("statuses/user_timeline", parameters)

  return /** @type {Status[]} */ (data)
}

/**
 * Loop over all the pools in pools.js and fetch the tweets from their twitter
 * accounts. Return an array with an object per pool that contains it's name and
 * tweets.
 *
 * @returns {Promise<{pool: string, tweets: Status[]}[]>}
 */
const getTweetsByPool = async () => {
  const handles = pools.map((pool) => pool.handle)

  // Run all requests in parallell
  const promises = handles.map(getTweetsFromHandle)
  const tweetsByHandle = await Promise.all(promises)

  return tweetsByHandle.map((tweets, index) => ({
    pool: pools[index].name,
    tweets,
  }))
}

export default getTweetsByPool
