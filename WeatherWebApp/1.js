const weatherApiKey = 'b2fa3271ab55c9c76e1b2a2d1afd0478';
const weatherURL = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=`;
const imageApiKey = "2BsfBnNAfcAGF3oX4F_fRIlYnOXYBGYyJpeHfo8AWp4";
const imageURL = "https://api.unsplash.com/search/photos?page=1&query=";

const searchBox = document.querySelector(".search-box input");
const searchBtn = document.querySelector("#search");
const weatherIcon = document.querySelector(".weather-icon");
const appContainer = document.querySelector(".app-container");

window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelector("#preloader").style.display = "none";
  }, 1000);
  
  // Initial default city
  checkWeather("Kolkata");
  generateImage("Kolkata");
});

// Weather API call
async function checkWeather(city) {
  const errorBox = document.querySelector(".error");
  const weatherBox = document.querySelector(".weather");

  const response = await fetch(weatherURL + city + `&appid=${weatherApiKey}`);
  const data = await response.json();

  if (response.status === 404 || !data.name) {
    // Show error and default background
    errorBox.style.display = 'block';
    weatherBox.style.display = 'none';
    appContainer.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("images/weather.jpg")`;
    return;
  }

  // Valid city, hide error and update data
  errorBox.style.display = 'none';
  weatherBox.style.display = 'block';

  await generateImage(city);  // Only call image API for valid city
  updateData(data);
}

// Update weather data
async function updateData(data) {
  document.querySelector("#city").textContent = data.name;
  document.querySelector("#temp").textContent = Math.round(data.main.temp) + "°C";
  document.querySelector(".humidity").textContent = data.main.humidity + '%';
  document.querySelector(".wind").textContent = data.wind.speed + " km/h";
  document.querySelector("#condition").textContent = data.weather[0].description;

  const weatherMain = data.weather[0].main;

  switch (weatherMain) {
    case "Clear": weatherIcon.src = "images/clear.png"; break;
    case "Clouds": weatherIcon.src = "images/clouds.png"; break;
    case "Rain": weatherIcon.src = "images/rain.png"; break;
    case "Drizzle": weatherIcon.src = "images/drizzle.png"; break;
    case "Mist": weatherIcon.src = "images/mist.png"; break;
    case "Snow": weatherIcon.src = "images/snow.png"; break;
    default: weatherIcon.src = "images/clear.png"; break;
  }
}

// Generate image for the valid city
async function generateImage(city) {
  const response = await fetch(imageURL + city + `&client_id=${imageApiKey}`);
  const data = await response.json();

  if (data.results.length > 0) {
    const img = data.results[0].urls.full;
    appContainer.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${img})`;
  } else {
    appContainer.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('images/weather.jpg')`;  // Default fallback image
  }
}

// Event listeners for search button and Enter key
searchBtn.addEventListener('click', () => {
  const city = searchBox.value.trim();
  if (city) {
    checkWeather(city);
  }
});

searchBox.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchBtn.click();
  }
});
