const express = require('express')
const axios = require('axios')
const redis = require('redis')
const cors = require('cors')
const logger = require('morgan')

require('dotenv').config()

const app = express()
const port = process.env.PORT || 3001
const redisUrl = process.env.REDIS_URL ?? 'redis://redis:6379'

app.use(cors())
app.use(logger('dev'))

async function fetchApiData(species) {
  const url = `https://www.fishwatch.gov/api/species/${species}`
  const apiResponse = await axios.get(url)

  console.log(`Request sent to ${url}`)

  return apiResponse.data
}

async function getCachedData(req, res, next) {
  const { species } = req.params

  try {
    const cacheResults = await redisClient.get(species)

    if (cacheResults) {
      const results = JSON.parse(cacheResults)

      console.log('Results retrieved from cache')

      res.send({ fromCache: true, data: results })
    } else {
      next()
    }
  } catch (error) {
    console.error(error)
    res.status(404)
  }
}

async function getSpeciesData(req, res) {
  const { species } = req.params

  try {
    const results = await fetchApiData(species)

    if (results.length === 0) {
      throw new Error('API returned an empty array!')
    }

    await redisClient.set(species, JSON.stringify(results), {
      EX: 180,
      NX: true,
    })

    res.send({ fromCache: false, data: results })
  } catch (error) {
    console.error(error)
    res.status(404).send('Data unavailable!')
  }
}

app.get('/fish/:species', getCachedData, getSpeciesData)

const redisClient = redis.createClient({ url: redisUrl })
redisClient.on('error', (error) => console.error(`Error: ${error}`))

redisClient.connect().then(() => {
  console.log('Cache server connection successful')

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
  })
})
