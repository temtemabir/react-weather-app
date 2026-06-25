import React from 'react';
import { getCustomIcon } from '../utils/weatherUtils';

const DailyForecast = ({ forecasts, onSelect }) => (
  <div className="forecast-section">
    {forecasts.map((f) => (
      <div key={f.day} className="forecast-card" onClick={() => onSelect(f)}>
        <div className="day">{f.day}</div>
        <div className="small-icon" style={{ fontSize: "40px" }}>{getCustomIcon(f.icon)}</div>
        <div className="temps">
          <span className="min">{Math.round(f.min)}°</span> ↓
          <span className="max">{Math.round(f.max)}°</span> ↑
        </div>
      </div>
    ))}
  </div>
);

export default DailyForecast;