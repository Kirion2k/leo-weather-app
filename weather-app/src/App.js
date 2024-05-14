import React, { useState } from 'react';
import axios from 'axios';
import './index.css';

function App() {
  const [location, setLocation] = useState('');
  const [data, setData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [view, setView] = useState('current'); // 'current' or 'forecast'
  const [isForecastShown, setIsForecastShown] = useState(false);

  const apiKey = 'f331c633b4eef1787c1b5f80f96c3bb5';

  const search = (event) => {
    if (event.key === 'Enter') {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${apiKey}`;

      Promise.all([
        axios.get(weatherUrl),
        axios.get(forecastUrl)
      ]).then(([weatherResponse, forecastResponse]) => {
        setData(weatherResponse.data);
        setForecast(processForecast(forecastResponse.data));
        setLocation(''); // Reset input after search
      }).catch(error => {
        console.error("Failed to fetch data:", error);
        setData(null);
        setForecast([]);
      });
    }
  }

  const processForecast = (forecastData) => {
    let dailyData = {};

    forecastData.list.forEach((reading) => {
      const date = new Date(reading.dt_txt).toLocaleDateString();
      if (!dailyData[date]) {
        dailyData[date] = [];
      }
      dailyData[date].push(reading);
    });

    return Object.keys(dailyData).map(date => {
      const dayReadings = dailyData[date];
      const temps = dayReadings.map(read => read.main.temp);
      return {
        date: date,
        day: new Date(dayReadings[0].dt_txt).toLocaleDateString('en-us', { weekday: 'long' }),
        highTemp: Math.max(...temps),
        lowTemp: Math.min(...temps),
        condition: dayReadings[0].weather[0].main,
        icon: getWeatherIcon(dayReadings[0].weather[0].main)
      };
    });
  }

  // Function to select the icon based on the weather condition
  const getWeatherIcon = (weather) => {
    const condition = weather.toLowerCase();
    switch (condition) {
      case 'clear':
      return '/weather_icon/sunny.png';
      case 'clouds':
        return '/weather_icon/cloudy.png';
      case 'rain':
        return '/weather_icon/raindrops.png';
      case 'snow':
        return '/weather_icon/snow.png';
      case 'thunderstorm':
        return '/weather_icon/thunderstorm.png';
      case 'haze':
              return '/weather_icon/haze.png';
      default:
        return 'url_to_default_weather_icon.png'; // A default icon if no match is found
    }
  }

  // Function to toggle view
  const toggleView = () => {
    setView(view === 'current' ? 'forecast' : 'current');
  };

  return (
      <div className="min-h-screen flex flex-col items-center pt-12 pb-12 transition-all duration-500 ease-in-out"
        style={{ alignItems: data ? 'center' : 'center', justifyContent: data ? 'center' : 'center',  }}>
        <div className="max-w-md w-full space-y-8 ">
          <div className="bg-white shadow-md rounded-xl px-8 pt-6 pb-5 mb-4 transition-opacity duration-500 ease-in-out">
            <div className="text-center text-2xl pb-3 font-bold transition-opacity duration-300 ease-in-out">
              Leo's Weather App
            </div>
            <div className="mb-4">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out"
                type="text"
                placeholder="Enter City Name"
                value={location}
                onChange={event => setLocation(event.target.value)}
                onKeyPress={search}
              />
            </div>
          </div>
          {data && (
            <div className="info-container bg-white shadow-md rounded-xl px-8 pt-6 pb-8 mb-4 transform transition-all duration-500 ease-in-out">
              <div className="views" style={{ transform: `translateX(${view === 'current' ? '0%' : '-56%'})` }}>
                <div className="view current-view pb-6">
                  <div className="text-center flex items-center flex-col">
                    <p className="text-9xl">{Math.round(data.main.temp)}°C</p>
                    <p className="text-4xl text-blue-500">{data.weather[0].main}</p>
                    <img src={getWeatherIcon(data.weather[0].main)} alt="Weather Icon" style={{ width: "200px", height: "200px", padding: "10px"}} />
                    <p className="text-3xl">{data.name}, {data.sys.country}</p>
                  </div>
                </div>
                <div className="view forecast-view">
                  {/* Forecast Data */}
                  <h2 className="forecast-title text-2xl font-bold mb-4 ml-14 pl-5 text-center">5-Day Forecast</h2>
                  {forecast.map((day, index) => (
                    <div key={index} className="forecast-day ml-20 mb-2 flex justify-between items-center">
                      <p>{day.day}</p>
                      <img src={day.icon} alt="Weather Icon" style={{ width: "50px", height: "50px" }} />
                      <p>High: {Math.round(day.highTemp)}°C</p>
                      <p>Low: {Math.round(day.lowTemp)}°C</p>
                      <p>{day.condition}</p>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={toggleView} className="toggle-button">
                <img src={view === 'current' ? 'arrow-right-solid.svg' : 'arrow-left-solid.svg'} alt="Toggle View" className="arrow-icon" />
              </button>
            </div>
          )}
        </div>
    </div>
  );
}

export default App;
