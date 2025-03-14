// Функція для отримання даних погоди з OpenWeather API
async function fetchWeatherData(city) {
  const apiKey = "5d5d8d35740cabf7e723aa4ac9d44954"; // Замініть на ваш API ключ
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=uk`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Не вдалося отримати дані");
    }
    const data = await response.json();
    updateCurrentWeather(data);
    fetchForecastData(city); // Додано виклик для отримання прогнозу
  } catch (error) {
    document.getElementById("error-message").textContent = error.message;
    document.getElementById("error-message").classList.remove("hidden");
  }
}

// Функція для отримання прогнозу погоди на 5 днів
async function fetchForecastData(city) {
  const apiKey = "YOUR_API_KEY"; // Замініть на ваш API ключ
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=uk`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Не вдалося отримати дані прогнозу");
    }
    const data = await response.json();
    updateForecastWeather(data);
  } catch (error) {
    console.error("Error fetching forecast data:", error);
  }
}

// Функція для оновлення поточної погоди
function updateCurrentWeather(data) {
  document.getElementById("city-name").textContent = data.name;
  document.getElementById("current-date").textContent =
    new Date().toLocaleDateString("uk-UA");
  document.getElementById("current-temp").textContent = `${data.main.temp}°C`;
  document.getElementById("current-description").textContent =
    data.weather[0].description;
  document.getElementById("wind").textContent = `Вітер: ${data.wind.speed} м/с`;
  document.getElementById(
    "humidity"
  ).textContent = `Вологість: ${data.main.humidity}%`;
  document.getElementById(
    "pressure"
  ).textContent = `Тиск: ${data.main.pressure} гПа`;

  const iconCode = data.weather[0].icon;
  const iconElement = document.getElementById("current-icon");
  iconElement.src = `https://openweathermap.org/img/wn/${iconCode}.png`;
  iconElement.alt = "Іконка погоди";

  document.getElementById("current-weather").classList.remove("hidden");
}

// Функція для оновлення прогнозу погоди на 5 днів
function updateForecastWeather(data) {
  const forecastContainer = document.getElementById("forecast-container");
  forecastContainer.innerHTML = ""; // Очистити попередній прогноз

  // Фільтрувати дані для отримання прогнозу на кожен день
  const dailyData = data.list.filter((reading) =>
    reading.dt_txt.includes("12:00:00")
  );

  dailyData.forEach((day) => {
    const date = new Date(day.dt_txt).toLocaleDateString("uk-UA");
    const temp = `${day.main.temp}°C`;
    const description = day.weather[0].description;
    const iconCode = day.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

    const forecastElement = document.createElement("div");
    forecastElement.classList.add("forecast-day");
    forecastElement.innerHTML = `
      <p>${date}</p>
      <img src="${iconUrl}" alt="Іконка погоди">
      <p>${temp}</p>
      <p>${description}</p>
    `;

    forecastContainer.appendChild(forecastElement);
  });
}

// Додати обробник подій для кнопки пошуку
document.getElementById("search-btn").addEventListener("click", () => {
  const city = document.getElementById("city-input").value;
  if (city) {
    fetchWeatherData(city);
  }
});
