const apiKey = "4d14e22ed8fd24498528658e6271da2b";

async function fetchWeather(city) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
  const data = await response.json();
  return data;
}

async function fetchFutureWeather(city) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
  const data = await response.json();
  return data;
}

function displayCurrentWeather(data) {
  // Display current weather data
  if (!data || !data.weather || data.weather.length === 0) {
    console.error('Invalid weather data:', data);
    return;
  }

  const { name, weather, main, wind } = data;
  const iconUrl = `https://openweathermap.org/img/w/${weather[0].icon}.png`;

  document.getElementById('current-city').innerHTML = `
    <h2>${name}</h2>
    <p>Date: ${new Date().toLocaleDateString()}</p>
    <img src="${iconUrl}" alt="${weather[0].description}">
    <p>Temperature: ${main.temp}°C</p>
    <p>Humidity: ${main.humidity}%</p>
    <p>Wind Speed: ${wind.speed} m/s</p>
  `;
}

