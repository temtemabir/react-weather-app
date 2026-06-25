import React from 'react';
import { getCustomIcon } from '../utils/weatherUtils';

const MainInfo = ({ formattedDate, selectedCity, temp, icon, setShowDetails }) => (
  <div className="main-info">
    <div className="datetime"><div className="date">{formattedDate}</div></div>
    <div className="location"><span>📍</span> {selectedCity}</div>
    <div className="temp"><span className="value">{temp}</span><span className="deg">°C</span></div>
    <div className="big-icon" onClick={() => setShowDetails(true)} style={{ cursor: "pointer", fontSize: "120px" }}>
      {getCustomIcon(icon)}
    </div>
  </div>
);

export default MainInfo;