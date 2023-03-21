import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({country}) => {
    const [weather, setWeather] = useState(null)
    const icon = (weather ? weather.weather[0].icon : undefined)
    const description = (weather ? weather.weather[0].description : undefined)
  
    useEffect(() => {
      const location = country.capital
      const code = country.cca2
      const apiKey = process.env.REACT_APP_WEATHER_API_KEY
  
      axios
        .get(`http://api.openweathermap.org/data/2.5/weather?q=${location},${code}&units=metric&APPID=${apiKey}`)
        .then(response => {
          setWeather(response.data)
        })
    }, [country])
  
    return (
      <div>
        <h2>Weather in {country.capital}</h2>
        {weather && <div>temperature {weather.main.temp.toFixed(1)} Celcius</div>}
        {weather && <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt={description} />}
        {weather && <div>wind {weather.wind.speed} m/s</div>}
      </div>
    )
}

export default Weather