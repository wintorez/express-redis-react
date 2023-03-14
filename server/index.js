const express = require('express')
const axios = require('axios')
const redis = require('redis')
const cors = require('cors')
const logger = require('morgan')

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(logger('dev'))

let redisClient

if (process.env.NODE_ENV === 'production') {
  ;(async () => {
    redisClient = redis.createClient({ url: 'redis://redis:6379' })

    redisClient.on('error', (error) => console.error(`Error: ${error}`))

    await redisClient.connect()
  })()
}

async function fetchApiData(species) {
  const url = `https://www.fishwatch.gov/api/species/${species}`
  const apiResponse = await axios.get(url)

  console.log(`Request sent to ${url}`)

  return apiResponse.data
}

async function getCachedData(req, res, next) {
  const { species } = req.params
  let results

  try {
    const cacheResults = await redisClient.get(species)

    if (cacheResults) {
      results = JSON.parse(cacheResults)

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
  let results

  try {
    results = await fetchApiData(species)

    if (results.length === 0) {
      throw new Error('API returned an empty array!')
    }

    if (process.env.NODE_ENV === 'production') {
      await redisClient.set(species, JSON.stringify(results), {
        EX: 180,
        NX: true,
      })
    }

    res.send({
      fromCache: false,
      data: results,
    })
  } catch (error) {
    console.error(error)
    res.status(404).send('Data unavailable!')
  }
}

if (process.env.NODE_ENV === 'production') {
  app.get('/fish/:species', getCachedData, getSpeciesData)
} else {
  app.get('/fish/:species', getSpeciesData)
}

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
