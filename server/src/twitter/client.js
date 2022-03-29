import Twit from "twit"

/** @type {Twit | undefined} */
let twitClient

const createTwitClient = () => {
  /* eslint-disable @typescript-eslint/naming-convention */
  /* eslint-disable camelcase */
  const {
    ACCESS_TOKEN: access_token,
    ACCESS_TOKEN_SECRET: access_token_secret,
    CONSUMER_KEY: consumer_key,
    CONSUMER_SECRET: consumer_secret,
  } = process.env

  if (access_token && access_token_secret && consumer_key && consumer_secret) {
    twitClient = new Twit({
      access_token,
      access_token_secret,
      consumer_key,
      consumer_secret,
    })
    /* eslint-enable @typescript-eslint/naming-convention */
    /* eslint-enable camelcase */
  } else {
    console.error(
      "Can't instantiate Twit client, check ACCESS_TOKEN, ACCESS_TOKEN_SECRET, CONSUMER_KEY and CONSUMER_SECRET env variables",
    )
  }
}

const getTwitClient = () => {
  if (!twitClient) throw new Error("Error retrieving Twit client")

  return twitClient
}

export { createTwitClient, getTwitClient }
