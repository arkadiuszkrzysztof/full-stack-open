import { useState, useEffect } from 'react'
import axios from 'axios'

import Country from './components/Country'
import Countries from './components/Countries'
import Weather from './components/Weather'

const App = () => {
  const [filter, setFilter] = useState('')
  const [countriesData, setCountriesData] = useState([])

  const handleFilterChange = (event) => setFilter(event.target.value)

  const showCountry = (name) => setFilter(name)

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountriesData(response.data)
      })
  }, [])

  const countriesToDisplay = countriesData.filter(country => country.name.common.toLowerCase().indexOf(filter.toLowerCase()) >=0)

  return (
    <div>
      find countries <input value={filter} onChange={handleFilterChange} /> <br />
      {
        countriesToDisplay.length > 10 ? 'Too many matches, specify another filter' 
        : countriesToDisplay.length > 1 ? <Countries countries={countriesToDisplay} handleClick={showCountry} /> 
        : countriesToDisplay.length === 1 ? <><Country country={countriesToDisplay[0]} /><Weather country={countriesToDisplay[0]} /></>
        : 'No results found'
      }
    </div>
  );
}

export default App;
