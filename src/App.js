import React, { useState, useEffect, useMemo } from "react";
import "./App.css";
import MapView from "./components/MapView";
import SearchBar from "./components/SearchBar";
import MainInfo from "./components/MainInfo";
import HourlyForecast from "./components/HourlyForecast";
import DailyForecast from "./components/DailyForecast";
import WeatherDetails from "./components/WeatherDetails";
import * as weatherUtils from "./utils/weatherUtils";

export default function App() {
  const [currentWeather, setCurrentWeather] = useState("Clear");
  const [dateTime, setDateTime] = useState(new Date());
  const [showMap, setShowMap] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Médenine");
  const [selectedForecast, setSelectedForecast] = useState(null);
  const [searchCity, setSearchCity] = useState("");
  const [forecasts, setForecasts] = useState([]); 
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function loadData() {
      const w = await weatherUtils.fetchWeather(selectedCity);
      if (w) {
        setDetails(w);
        setCurrentWeather(w.icon);
      }
      const f = await weatherUtils.fetchForecast(selectedCity);
      setForecasts(f);
    }
    loadData();
  }, [selectedCity]);

  const baseTemp = selectedForecast?.temp ?? details?.temp ?? null;
  const activeIcon = selectedForecast ? selectedForecast.icon : currentWeather;

  const hourlyData = useMemo(() => {
    if (baseTemp === null) return [];
    return weatherUtils.generateHourlyData(baseTemp, activeIcon);
  }, [baseTemp, activeIcon]);

  const handleSearch = () => {
    if (searchCity.trim()) {
      setSelectedCity(searchCity.trim());
      setSelectedForecast(null);
      setSearchCity("");
    }
  };

  const getGif = () => {
    if (details?.sunrise && weatherUtils.isNightTime(details.sunrise, details.sunset)) return "/night.gif";
    switch (activeIcon) {
      case "Clear": return "/sun.gif";
      case "Snow": return "/snow-4770_256.gif";
      case "Rain": return "/rain-6812.gif";
      case "Clouds": return "/fall-22603.gif";
      default: return "/sun.gif";
    }
  };

  const formattedDate = selectedForecast
    ? selectedForecast.date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
    : dateTime.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

  if (showMap) return (
    <div className="map-page">
      <button className="back-button" onClick={() => setShowMap(false)}>🔙</button>
      <MapView setSelectedCity={setSelectedCity} setCurrentWeather={setCurrentWeather} />
    </div>
  );

  if (showDetails) return (
    <WeatherDetails 
      details={details} 
      city={selectedCity} 
      icon={activeIcon} 
      date={formattedDate} 
      onBack={() => setShowDetails(false)}
      bgGif={getGif()}
    />
  );

  return (
    <div className="weather-app">
      <img src={getGif()} alt="bg" className="background-gif" />
      <div className="overlay">
        <SearchBar searchCity={searchCity} setSearchCity={setSearchCity} handleSearch={handleSearch} />
        
        <MainInfo 
          formattedDate={formattedDate} 
          selectedCity={selectedCity} 
          temp={baseTemp} 
          icon={activeIcon} 
          setShowDetails={setShowDetails} 
        />

        <HourlyForecast hourlyData={hourlyData} />

        <DailyForecast 
          forecasts={forecasts} 
          onSelect={(f) => {
            setSelectedForecast({...f, temp: Math.round((f.min + f.max)/2)});
            setCurrentWeather(f.icon);
          }} 
        />

        <div className="map-icon" onClick={() => setShowMap(true)}>🗺️</div>
      </div>
    </div>
  );
}