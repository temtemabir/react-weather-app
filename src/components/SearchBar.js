import React from 'react';

const SearchBar = ({ searchCity, setSearchCity, handleSearch }) => (
  <div className="search-bar">
    <input
      value={searchCity}
      onChange={e => setSearchCity(e.target.value)}
      onKeyDown={e => e.key === "Enter" && handleSearch()}
      placeholder="Rechercher une ville..."
    />
    <button onClick={handleSearch}>🔍</button>
  </div>
);

export default SearchBar;