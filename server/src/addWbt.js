const getWbt = () => -1

/**
 * @param {{pool: string, temperature: number | undefined,}[]} temperatures
 */
const addWbt = (temperatures) =>
  temperatures.map(({ pool, temperature }) => ({
    pool,
    temperature: temperature ?? getWbt(),
  }))

export default addWbt
