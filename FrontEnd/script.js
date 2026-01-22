const API_KEY = "use_your_openweathermap_api_key_here";
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const loader = document.getElementById("loader");
const weatherBox = document.getElementById("weather");
const errorBox = document.getElementById("error");
const toggleUnit = document.getElementById("toggleUnit");

let isCelsius = true;
let currentTempC = 0;

searchBtn.addEventListener("click", fetchWeather);
toggleUnit.addEventListener("click", toggleTemperature);

async function fetchWeather() {
  const city = cityInput.value.trim();
  if (!city) return;

  loader.classList.remove("hidden");
  weatherBox.classList.add("hidden");
  errorBox.classList.add("hidden");

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );
    if (!res.ok) throw new Error("City not found");
    const data = await res.json();
    displayWeather(data);
  } catch {
    errorBox.classList.remove("hidden");
  } finally {
    loader.classList.add("hidden");
  }
}

function displayWeather(data) {
  currentTempC = Math.round(data.main.temp);

  document.getElementById("location").textContent =
    `${data.name}, ${data.sys.country}`;

  document.getElementById("temperature").textContent =
    `${currentTempC}°`;

  document.getElementById("description").textContent =
    data.weather[0].description;

  document.getElementById("icon").src =
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

  document.getElementById("humidity").textContent =
    `${data.main.humidity}%`;

  document.getElementById("wind").textContent =
    `${data.wind.speed} m/s`;

  document.getElementById("feels").textContent =
    `${Math.round(data.main.feels_like)}°`;

  document.getElementById("sunrise").textContent =
    formatTime(data.sys.sunrise);

  document.getElementById("sunset").textContent =
    formatTime(data.sys.sunset);

  weatherBox.classList.remove("hidden");
}

function toggleTemperature() {
  if (isCelsius) {
    const f = Math.round((currentTempC * 9) / 5 + 32);
    document.getElementById("temperature").textContent = `${f}°`;
    toggleUnit.textContent = "°F";
  } else {
    document.getElementById("temperature").textContent = `${currentTempC}°`;
    toggleUnit.textContent = "°C";
  }
  isCelsius = !isCelsius;
}

function formatTime(unix) {
  return new Date(unix * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
