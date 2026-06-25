import React from 'react';

const HourlyForecast = ({ hourlyData }) => (
  <div className="hourly-line">
    {hourlyData.map((item, i) => (
      <div key={i} className="hour-block">
        <div className="hour">{item.hour}</div>
        <div className="hour-icon">{item.icon}</div>
        <div className="hour-temp">{item.temp}°</div>
      </div>
    ))}
  </div>
);

export default HourlyForecast;