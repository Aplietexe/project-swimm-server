import fetch from "node-fetch"

const fetchOpenWeather = async () => {
  if (!process.env.OPEN_WEATHER_APP_ID)
    throw new Error("OPEN_WEATHER_APP_ID environment variable must be set")

  const parameters = {
    appid: process.env.OPEN_WEATHER_APP_ID,
    lat: "51.5072",
    lon: "0.1276",
    units: "metric",
  }

  const stringParameters = new URLSearchParams(parameters).toString()

  const url = `https://api.openweathermap.org/data/2.5/weather?${stringParameters}`

  const response = await fetch(url)

  if (!response.ok)
    throw new Error("Error fetching weather, response status is not OK")

  return /** @type {{main?: {temp?: number}}} */ (await response.json())
}

const getWeatherTemperature = async () => {
  const openWeatherData = await fetchOpenWeather()

  const weatherTemperature = openWeatherData.main?.temp

  if (!weatherTemperature)
    throw new Error("Error fetching weather, OpenWeather response has no temp")

  return weatherTemperature
}

export default getWeatherTemperature
