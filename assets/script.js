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
  const currentCity = document.getElementById('current-city');
  currentCity.innerHTML = '';

  const cityName = document.createElement('h2');
  cityName.textContent = data.name;
  currentCity.appendChild(cityName);

  const icon = document.createElement('img');
  icon.src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
  icon.alt = data.weather[0].description;
  currentCity.appendChild(icon);

  const temperature = document.createElement('p');
  temperature.textContent = `Temperature: ${data.main.temp}°C`;
  currentCity.appendChild(temperature);

  const humidity = document.createElement('p');
  humidity.textContent = `Humidity: ${data.main.humidity}%`;
  currentCity.appendChild(humidity);

  const windSpeed = document.createElement('p');
  windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;
  currentCity.appendChild(windSpeed);
}

function displayFutureWeather(data) {
  const futureForecast = document.getElementById('5-day-forecast');
  futureForecast.innerHTML = '';

  const forecastTitle = document.createElement('h2');
  forecastTitle.textContent = '5-Day Forecast:';
  futureForecast.appendChild(forecastTitle);

  const forecastList = document.createElement('ul');
  forecastList.classList.add('forecast-list');
  futureForecast.appendChild(forecastList);

  // Display weather forecast for each day
  const forecasts = data.list.filter((item, index) => index % 8 === 0); // Get forecast for every 24 hours (8 entries per day)
  forecasts.forEach(forecast => {
      const date = new Date(forecast.dt * 1000);
      const forecastItem = document.createElement('li');
      forecastItem.classList.add('forecast-item');

      const dateText = document.createElement('p');
      dateText.textContent = date.toLocaleDateString();
      forecastItem.appendChild(dateText);

      const weatherIcon = document.createElement('img');
      weatherIcon.src = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
      weatherIcon.alt = forecast.weather[0].description;
      forecastItem.appendChild(weatherIcon);

      const temperature = document.createElement('p');
      temperature.textContent = `Temperature: ${forecast.main.temp}°C`;
      forecastItem.appendChild(temperature);

      const windSpeed = document.createElement('p');
      windSpeed.textContent = `Wind Speed: ${forecast.wind.speed} m/s`;
      forecastItem.appendChild(windSpeed);

      const humidity = document.createElement('p');
      humidity.textContent = `Humidity: ${forecast.main.humidity}%`;
      forecastItem.appendChild(humidity);

      forecastList.appendChild(forecastItem);
  });
}

function addToSearchHistory(city) {
  let searchHistory = localStorage.getItem('searchHistory');
  if (!searchHistory) {
      searchHistory = [];
  } else {
      searchHistory = JSON.parse(searchHistory);
  }

  searchHistory.push(city);
  searchHistory = searchHistory.slice(-5); // Keep only the last 5 cities searched

  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  displaySearchHistory(searchHistory);
}

function displaySearchHistory(searchHistory) {
  const historyList = document.getElementById('history-list');
  historyList.innerHTML = '';

  const historyTitle = document.createElement('h2');
  historyTitle.textContent = 'Search History:';
  historyList.appendChild(historyTitle);

  const historyItems = document.createElement('ul');
  historyItems.classList.add('history-list');
  searchHistory.forEach(city => {
      const historyItem = document.createElement('li');
      historyItem.classList.add('history-item');
      historyItem.textContent = city;
      historyItems.appendChild(historyItem);
  });

  historyList.appendChild(historyItems);

  attachHistoryItemClickListeners(); // Attach click event listeners after updating the history list
}

function attachHistoryItemClickListeners() {
  const historyItems = document.querySelectorAll('.history-item');
  historyItems.forEach(item => {
      item.addEventListener('click', () => {
          const city = item.textContent;
          fetchAndDisplayWeather(city);
      });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  displaySearchHistory(searchHistory);
});

document.getElementById('search-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = document.getElementById('city-input').value;
  addToSearchHistory(city);
  const currentWeatherData = await fetchWeather(city);
  displayCurrentWeather(currentWeatherData);
  const futureWeatherData = await fetchFutureWeather(city);
  displayFutureWeather(futureWeatherData);
});