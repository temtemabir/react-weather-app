import React, { useState, useEffect, useMemo } from "react";

import SearchBar from "./SearchBar";
import MainInfo from "./MainInfo";
import HourlyForecast from "./HourlyForecast";
import DailyForecast from "./DailyForecast";
import WeatherDetails from "./WeatherDetails";
import MapView from "./MapView";

import {
  fetchWeather,
  fetchForecast,
  fetchDetailedWeather,
  generateHourlyData,
  getGif
} from "../utils/weatherUtils";

export default function WeatherApp() {
  const [currentWeather, setCurrentWeather] = useState("Clear");
  const [showMap, setShowMap] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Médenine");
  const [selectedForecast, setSelectedForecast] = useState(null);
  const [searchCity, setSearchCity] = useState("");
  const [forecasts, setForecasts] = useState([]);
  const [details, setDetails] = useState(null);

  useEffect(() => {
    async function loadData() {
      const weather = await fetchWeather(selectedCity);
      if (weather) setCurrentWeather(weather.icon);

      const fc = await fetchForecast(selectedCity);
      setForecasts(fc);

      const det = await fetchDetailedWeather(selectedCity);
      setDetails(det);
    }
    loadData();
  }, [selectedCity]);

  const baseTemp = selectedForecast?.temp ?? details?.temp ?? null;

  const hourlyData = useMemo(() => {
    if (baseTemp == null) return [];
    const weather = selectedForecast ? selectedForecast.icon : currentWeather;
    return generateHourlyData(baseTemp, weather);
  }, [baseTemp, selectedForecast, currentWeather]);

  if (showMap) {
    return (
      <MapView
        setSelectedCity={setSelectedCity}
        setCurrentWeather={setCurrentWeather}
      />
    );
  }

  if (showDetails) {
    return (
      <WeatherDetails
        details={details}
        selectedForecast={selectedForecast}
        currentWeather={currentWeather}
        setShowDetails={setShowDetails}
      />
    );
  }

  return (
    <div className="weather-app">
      <img
        src={getGif(details, selectedForecast, currentWeather)}
        className="background-gif"
        alt="background"
      />

      <SearchBar
        searchCity={searchCity}
        setSearchCity={setSearchCity}
        handleSearch={() => {
          if (searchCity.trim()) {
            setSelectedCity(searchCity);
            setSelectedForecast(null);
            setSearchCity("");
          }
        }}
      />

      <MainInfo
        selectedCity={selectedCity}
        baseTemp={baseTemp}
        currentWeather={currentWeather}
        selectedForecast={selectedForecast}
        setShowDetails={setShowDetails}
      />

      <HourlyForecast hourlyData={hourlyData} />

      <DailyForecast
        forecasts={forecasts}
        setSelectedForecast={setSelectedForecast}
        setCurrentWeather={setCurrentWeather}
      />

      <button onClick={() => setShowMap(true)}>🗺️</button>
    </div>
  );
}

