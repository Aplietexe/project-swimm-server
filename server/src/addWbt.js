import fetch from "node-fetch"

const getWbt = async () => {
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
    throw new Error("Error fetching WBT, response status is not OK")

  const json = /** @type {{main?: {temp?: number}}} */ (await response.json())

  const wbt = json.main?.temp

  if (!wbt) throw new Error("Error fetching WBT, the response has no temp")

  return wbt
}

/**
 * @param {{pool: string, temperature: number | undefined,}[]} temperatures
 * @returns {temperatures is {pool: string, temperature: number}[]}
 */
const areTemperaturesComplete = (temperatures) =>
  temperatures.every((temperatureWithPool) => temperatureWithPool.temperature)

/**
 * @param {{pool: string, temperature: number | undefined,}[]} temperatures
 */
const addWbt = async (temperatures) => {
  if (areTemperaturesComplete(temperatures)) return temperatures

  const wbt = await getWbt()

  return temperatures.map(({ pool, temperature }) => ({
    pool,
    temperature: temperature ?? wbt,
  }))
}

export default addWbt
