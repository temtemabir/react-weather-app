import React from 'react';
import { 
  getCustomIcon, 
  getAdvice, 
  getBestMoment, 
  getActivities 
} from '../utils/weatherUtils';

const WeatherDetails = ({ details, city, icon, date, onBack, bgGif }) => {
  return (
    <div className="details-page">
      <img src={bgGif} alt="background" className="background-gif" />
      <div className="details-overlay">
        <button className="back-button" onClick={onBack}>🔙</button>

        <div className="details-header">
          <h1>{getCustomIcon(icon)} Détails Météo</h1>
          <p>{city} — {date}</p>
        </div>

        <div className="advice-box">
          {getAdvice(icon)}
        </div>

        <div className="details-cards-container">
          <div className="details-cards">
            <div className="detail-card"><span>🌡️</span><p>Température</p><h3>{details?.temp}°C</h3></div>
            <div className="detail-card"><span>🥵</span><p>Ressenti</p><h3>{details?.feels}°C</h3></div>
            <div className="detail-card"><span>💧</span><p>Humidité</p><h3>{details?.humidity}%</h3></div>
            <div className="detail-card"><span>🌬️</span><p>Vent</p><h3>{details?.wind} km/h</h3></div>
            <div className="detail-card"><span>👁️</span><p>Visibilité</p><h3>{details?.visibility} km</h3></div>
            <div className="detail-card"><span>🌅</span><p>Lever</p><h3>{details?.sunrise?.toLocaleTimeString().slice(0, 5)}</h3></div>
            <div className="detail-card"><span>🌇</span><p>Coucher</p><h3>{details?.sunset?.toLocaleTimeString().slice(0, 5)}</h3></div>
            <div className="detail-card"><span>⏰</span><p>Moment Idéal</p><h3>{getBestMoment(icon)}</h3></div>
            <div className="detail-card"><span>🎯</span><p>Activités</p><h3>{getActivities(icon)}</h3></div>
            <div className="detail-card"><span>☀️</span><p>Indice UV</p><h3>{details?.uv}</h3></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDetails;