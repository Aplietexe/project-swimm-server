import fetch from "node-fetch"

/**
 * Use the OpenWeather API to get weather data using OPEN_WEATHER_APP_ID
 * environment variable. An error is throw if the env variable is missing or if
 * the request fails.
 *
 * @returns {Promise<{main?: {temp?: number}}>} The OpenWeather API response
 * json
 */
const fetchOpenWeather = async () => {
  if (!process.env.OPEN_WEATHER_APP_ID)
    throw new Error("OPEN_WEATHER_APP_ID environment variable must be set")

  const parameters = {
    appid: process.env.OPEN_WEATHER_APP_ID,
    lat: "51.5072",
    lon: "0.1276",
    units: "metric",
  }

  // Convert the parameters to a string and append them to the url
  const stringParameters = new URLSearchParams(parameters).toString()

  const url = `https://api.openweathermap.org/data/2.5/weather?${stringParameters}`

  // Make the request
  const response = await fetch(url)

  // If the request failed, throw an error
  if (!response.ok)
    throw new Error("Error fetching weather, response status is not OK")

  // Get the json data and return it
  return /** @type {{main?: {temp?: number}}} */ (await response.json())
}

/**
 * Extract the temperature from weather data. An error is thrown if the response
 * doesn't have a temperature.
 *
 * @returns {Promise<number>}
 */
const getWeatherTemperature = async () => {
  // Fetch OpenWeather
  const openWeatherData = await fetchOpenWeather()

  // Extract the temperature
  const weatherTemperature = openWeatherData.main?.temp

  // Throw an error if there is no temperature
  if (!weatherTemperature)
    throw new Error("Error fetching weather, OpenWeather response has no temp")

  return weatherTemperature
}

export default getWeatherTemperature
