import { useState, useEffect } from 'react'
import axios from 'axios'
import _ from 'lodash'
import { formatValue } from './helpers'
import species from './species'

function App() {
  const [selection, setSelection] = useState(species[0])
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setLoading] = useState(false)

  const fetchSpecies = async () => {
    try {
      setLoading(true)

      const response = await axios.get(`//localhost:3001/fish/${selection}`)

      setData(response.data.data[0])
      setError(null)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSpecies()
  }, [selection])

  return (
    <div>
      <h1>Sustainable Seafood</h1>
      <div>
        <select
          value={selection}
          onChange={(e) => setSelection(e.target.value)}
        >
          {species.map((each) => (
            <option key={each} value={each}>
              {_.startCase(each)}
            </option>
          ))}
        </select>
        <br />
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : data ? (
          <dl>
            {Object.entries(data)
              .filter(([key, value]) => !_.isNil(value))
              .map(([key, value]) => [
                <dt key={key}>
                  <strong>{key}</strong>
                </dt>,
                <dd key={`${key}-value`}>{formatValue(key, value)}</dd>,
              ])}
          </dl>
        ) : null}
      </div>
    </div>
  )
}

export default App
