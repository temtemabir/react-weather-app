const API_KEY = process.env.REACT_APP_WEATHER_KEY;

export function getCustomIcon(condition) {
  switch (condition) {
    case "Clear": return "☀️";
    case "Clouds": return "🌤️";
    case "Rain": return "⛈️";
    case "Drizzle":
    case "Mist":
    case "Fog":
    case "Haze":
    case "wind": return "💨";
    case "Thunderstorm": return "⛈️";
    case "Snow": return "🌨️";
    default: return "🌤️";
  }
}

export async function fetchWeather(city) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=fr&appid=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    return {
      temp: Math.round(data.main.temp),
      icon: data.weather[0].main,
      desc: data.weather[0].main,
      feels: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      wind: Math.round(data.wind.speed * 3.6),
      visibility: data.visibility / 1000,
      sunrise: new Date(data.sys.sunrise * 1000),
      sunset: new Date(data.sys.sunset * 1000),
      uv: Math.floor(Math.random() * 11)
    };
  } catch (err) {
    console.error("Erreur API :", err);
    return null;
  }
}

export async function fetchForecast(city) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=fr&appid=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    const days = {};
    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString("fr-FR", { weekday: "long" });
      if (!days[day]) {
        days[day] = { day, min: item.main.temp_min, max: item.main.temp_max, icon: item.weather[0].main, date };
      } else {
        days[day].min = Math.min(days[day].min, item.main.temp_min);
        days[day].max = Math.max(days[day].max, item.main.temp_max);
      }
    });
    return Object.values(days).slice(1, 5);
  } catch (err) { return []; }
}


export const detailedWeather = {
  "Clear": { temp: 28, icon: "🌤️" },
  "Snow": { temp: 22, icon: "🌨️" },
  "Rain": { temp: 20, icon: "⛈️" },
  "Clouds": { temp: 21, icon: "💨" },
};

export const getHourlyIcon = (weather, hour) => {
  const isNight = hour < 6 || hour >= 18;
  if (isNight) {
    switch (weather) {
      case "Clear": return "🌙";
      case "Clouds": return "☁️🌙";
      case "Rain": return "🌧️🌙";
      case "Snow": return "❄️🌙";
      default: return "🌙";
    }
  }
  switch (weather) {
    case "Clear": return "☀️";
    case "Clouds": return "🌤️";
    case "Rain": return "🌧️";
    case "Snow": return "❄️";
    case "Thunderstorm": return "⛈️";
    default: return "🌤️";
  }
};

export const generateHourlyData = (baseTemp, weather) => {
  return Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0") + ":00";
    let tempVariation;
    if (i < 6) tempVariation = -5 + i * 0.5;
    else if (i < 12) tempVariation = -2 + (i - 6) * 2;
    else if (i < 16) tempVariation = 6 + (i - 12);
    else if (i < 20) tempVariation = 10 - (i - 16) * 2;
    else tempVariation = 2 - (i - 20);

    return {
      hour,
      temp: Math.round(baseTemp + tempVariation),
      icon: getHourlyIcon(weather, i) 
    };
  });
};

export function getAdvice(weather) {
  switch (weather) {
    case "Clear": return "☀️ Profite du beau temps, mais n'oublie pas la crème solaire.";
    case "Rain": return "🌧️ N'oublie pas ton parapluie, la pluie peut surprendre.";
    case "Snow": return "❄️ Sors bien couvert, les routes peuvent être glissantes.";
    default: return "🌤️ Passe une excellente journée !";
  }
}

export function getBestMoment(weather) {
  switch (weather) {
    case "Clear": return "🌅 Matin tôt ou après-midi";
    case "Clouds": return "🌤️ Après-midi";
    case "Rain": return "⛔ À éviter aujourd’hui";
    default: return "🌤️ Matin ou après-midi";
  }
}

export function getActivities(weather) {
  switch (weather) {
    case "Clear": return "🚶‍♂️ Marche – 🚴 Vélo – 🌳 Sortie";
    case "Clouds": return "☕ Café – 📚 Lecture – 🎧 Musique";
    default: return "😊 Activités variées possibles";
  }
}

export function isNightTime(sunrise, sunset) {
  const now = new Date();
  return now < sunrise || now > sunset;
}