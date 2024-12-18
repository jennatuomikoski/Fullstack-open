/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import axios from 'axios'

const FindCountries = ({search, handleSearch}) => {
  return (
    <div>
      <p>find countries <input value={search} onChange={handleSearch}/></p>
    </div>
  )
}

const CountryInfo = ({country}) => {
  const languages = country.languages
    ? Object.values(country.languages)
    : []

  return (
    <div>
      <h3>{country.name.common}</h3>
      <p>Capital {country.capital}</p>
      <p>Area {country.area}</p>
      <div>
        <h4>Languages:</h4>
        <ul>
          {languages.map((language, index) => (
            <li key={index}>{language}</li> 
          ))}
        </ul>
      </div>
      <div>
        <img src={country.flags.png} width={200}/>
      </div>
    </div>
  )
}

const CountryList = ({ countries, onShow })  => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  } else if (countries.length === 1) {
    return <CountryInfo country={countries[0]}/>
  }
  return(
    <div>
    {countries.map((country, index)=> (
      <div key={index}>
        <p>{country.name.common} <button onClick={() => onShow(country)}>show</button></p>    
      </div>
    ))}
  </div>
  )
}

const Weather = ({ weather }) => {
  if (weather.loading) {
    return <p>Loading weather...</p>
  }

  if (weather.error) {
    return <p>Error fetching weather data</p>
  }

  if (weather.data && weather.data.name) {
    return (
      <div>
        <h3>Weather in {weather.data.name}</h3>
        <p>Temperature: {weather.data.main.temp} °C</p>
        <img
          src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
          alt={weather.data.weather[0].description}
        />
        <p>Wind: {weather.data.wind.speed} m/s</p>
      </div>
    )
  }
}

function App() {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [filtered, setFiltered] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState({
    loading: false,
    data: {},
    error: false,
  })
  
  // get data from API
  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then(response => {
        setCountries(response.data);
      })
      .catch(error => {
        console.error("Error fetching the country data", error);
      });
  }, []);

  // filter results
  useEffect(() => {
    if (search) {
      const results = countries.filter(country =>
        country.name.common.toLowerCase().includes(search.toLowerCase())
      );
      setFiltered(results);

      if(results.length === 1 && results[0].capital) {
        setSelectedCountry(results[0])
        searchWeather(results[0].capital[0])
      } else {
        setSelectedCountry(null)
      }
    } else {
      setFiltered([]);
      setSelectedCountry(null)
    }
  }, [search, countries]);
 
  // handles search
    const handleSearch = (event) => {
      const searchValue = event.target.value
      setSearch(searchValue)
      // tyhjennä valittu maa ja sää jos hakua muokataan
      setSelectedCountry(null)
      setWeather({ loading: false, data: {}, error: false });

      const country = countries.find(
        (c) => c.name.common.toLowerCase() === searchValue.toLowerCase()
      )

      if (country && country.capital) {
        searchWeather(country.capital[0])
        setSelectedCountry(country)
      }
    }
  // handles showing country
    const handleShowCountry = (country) => {
      setSelectedCountry(country)
      searchWeather(country.capital[0])
    }

    //get weatherdata
    const searchWeather = async (city) => {
      if (!city) return      
      setWeather({ ...weather, loading: true })
      const API_KEY = import.meta.env.VITE_WEATHER_KEY
      const url = `https://api.openweathermap.org/data/2.5/weather`
      await axios
        .get(url, {
          params: {
            q: city,
            units: 'metric',
            appid: API_KEY,
          },
        })
        .then((res) => {
          console.log('res', res)
          setWeather({ data: res.data, loading: false, error: false})
        })
        .catch((error) => {
          setWeather({ ...weather, data: {}, error: true})
          console.log('error', error)
        })
    }

  return (
    <>
      <FindCountries search={search} handleSearch={handleSearch}/>
      {selectedCountry ? (
        <CountryInfo country={selectedCountry} />
      ) : (
        <CountryList countries={filtered} onShow={handleShowCountry} />
      )}
      <Weather weather={weather}/>
    </>
  )
}

export default App
