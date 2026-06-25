import React, { useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Popup,
  useMapEvents
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const API_KEY = "5e3e37aa54ffb95b417d5232a2a7e049";

const getWeatherEmoji = (main) => {
  switch (main) {
    case "Clouds": return "🌤️";
    case "Rain": return "🌧️";
    case "Thunderstorm": return "⛈️";
    case "Snow": return "🌨️";
    case "Wind": return "💨";
    default: return "☀️";
  }
};

function HoverWeather({ onWeather }) {
  const timeoutRef = useRef(null);

  useMapEvents({
    mousemove(e) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(async () => {
        const { lat, lng } = e.latlng;

        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${API_KEY}&lang=fr`
        );
        const data = await res.json();

        const temp = Math.round(data.main.temp);
        const emoji = getWeatherEmoji(data.weather[0].main);

        onWeather({ latlng: e.latlng, temp, emoji });
      }, 350); 
    }
  });

  return null;
}

export default function MapView() {
  const [hoverInfo, setHoverInfo] = useState(null);

  return (
    <MapContainer
      center={[36.8065, 10.1815]}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <HoverWeather onWeather={setHoverInfo} />

      {hoverInfo && (
        <Popup position={hoverInfo.latlng}>
          <div style={{ fontSize: "26px", textAlign: "center" }}>
            {hoverInfo.emoji}
            <div style={{ fontSize: "20px" }}>
              {hoverInfo.temp > 0 ? `+${hoverInfo.temp}°C` : `${hoverInfo.temp}°C`}
            </div>
          </div>
        </Popup>
      )}
    </MapContainer>
  );
}
