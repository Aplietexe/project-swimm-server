/** @type {{data?:{pool: string, temperature: number}[], expires: number}} */
const cache = {
  expires: 0,
}

const getCachedTemperatures = () => {
  if (Date.now() < cache.expires) return cache.data

  return undefined
}

/**
 * @param {{pool: string, temperature: number}[]} newData
 */
const setCachedTemperatures = (newData) => {
  cache.data = newData
  cache.expires = Date.now() + 60 * 1000
}

export { getCachedTemperatures, setCachedTemperatures }
