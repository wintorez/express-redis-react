const express = require('express')
const axios = require('axios')

const app = express()
const port = process.env.PORT || 3001

async function getSpeciesData(req, res) {
  const { species } = req.params

  try {
    const results = await axios
      .get(`https://www.fishwatch.gov/api/species/${species}`)
      .then((r) => r.data)

    if (results.length === 0) {
      throw new Error('API returned an empty array!')
    }

    res.send({
      fromCache: false,
      data: results,
    })
  } catch (error) {
    res.status(404).send('Data unavailable!')
  }
}

app.get('/fish/:species', getSpeciesData)

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`)
})
