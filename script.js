const searchCity = document.getElementById('searchCity');
const apiKey = '072186736d7f117b4444d3830a19729e';

// User Input to Search by City Name
searchCity.addEventListener('keyup', (event)=> {
  if(event.key == "Enter"){
    const city = searchCity.value.trim();
    let patt1 = /^[A-Za-z0-9- ]+$/;
    if(city !== '' && patt1.test(city)!==false){    // Validating user input
      updateRecentCities(city);
      showWeatherData(city);
    }
    else{
    alert('Please Enter a Valid City Name');
    return
    }
  }
});

// Fetch and Display Weather Data for the Entered City
async function showWeatherData(city) {
  try { 
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    if(!response.ok){
      throw new Error('City Not Found');    // Error Handling
    }
    const data = await response.json();
    
    if(data.cod !== '404' && data.message !== 'city not found'){    // Update Weather Details
      document.getElementById('locationName').innerHTML = data.name;
      document.getElementById('temperatureValue').innerHTML = `${data.main.temp}<sup>o</sup>C`;
      document.getElementById('weatherType').innerHTML = data.weather[0].description;
      document.getElementById('windSpeed').innerHTML = `${data.wind.speed} km/h`;
      document.getElementById('humidity').innerHTML = `${data.main.humidity}%`;
      document.getElementById('icon').src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    }
    else{
        document.getElementById('locationName').innerHTML = 'City Not Found or Invalid Location';
        searchCity.value = '';
    }
    let currentCity = data.name;
    showForecastData(currentCity);
  }
  catch(error){
    document.getElementById('locationName').innerHTML = `<p style="color:red">Error: ${error.message}</p>`;
  }
}

// Fetch and Display Extended Weather Forecasts
function showForecastData(city){
  document.getElementById('forecast-head').style.display = 'block';
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      const forecastContainer = document.getElementById('forecastContainer');
      forecastContainer.innerHTML = '';
      const dailyForecasts = {};
      
      data.list.forEach(element => {    // Process Forecast Data
        const dateTime = new Date(element.dt * 1000);
        const date = dateTime.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric'});
        
        if(!dailyForecasts[date]){
          dailyForecasts[date] = {
              date: date,
              icon: `https://openweathermap.org/img/w/${element.weather[0].icon}.png`,
              weatherType: element.weather[0].description,
              temperature: element.main.temp,
              windSpeed: element.wind.speed,
              humidity: element.main.humidity
          };
        }
      });

      Object.values(dailyForecasts).forEach(day => {    // Generates Forecast Cards
          const forecastCard = document.createElement('div');
          forecastCard.classList.add('box-card');

          forecastCard.innerHTML =                       // Organize Forecast Data Visually
            `<h3 class="text-lg font-semibold">${day.date}</h3>
              <img src="${day.icon}" class="w-16 h-16 mt-2">
              <p class="mt-2">Temp: ${day.temperature}<sup>o</sup>C</p>
              <p class="mt-2">Wind: ${day.windSpeed} km/h</p>
              <p class="mt-2">Humidity: ${day.humidity}%</p>`;

              forecastContainer.appendChild(forecastCard);
      });
    })
    .catch(err => console.error('Error fetching data',err));
    searchCity.value = '';
}

// Fetch Weather for User's Location
document.getElementById('location-btn').addEventListener('click', ()=>{
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(async (position) => {
      let {latitude, longitude} = position.coords;

      try{
        const responce = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
        if(!responce.ok){
          throw new Error('Failed to fetch current location');    
        }
        const data = await responce.json();
        let currentCity = data.name;
        updateRecentCities(currentCity);
        showWeatherData(currentCity);
      } 
      catch(error){       // Error Handling
        document.getElementById('locationName').innerHTML = `<p style="color:red">Error: ${error.message}</p>`;
      }
    },
    (error) => 
      document.getElementById('locationName').innerHTML = `<p style="color:red">Error: ${error.message}</p>`)
  }
});

// Manage Recent Cities
function updateRecentCities(city){
  if(!recentCities.includes(city)){
    recentCities.unshift(city);
  if(recentCities.length > 5)
    recentCities.pop();
    localStorage.setItem('recentCities', JSON.stringify(recentCities));   // Set Cities in LocalStorage
  }
}
let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];    // Get Cities from LocalStorage

// Update Dropdown for Recent Cities
searchCity.addEventListener('click', (event)=>{
  event.stopPropagation();
  updateDropdown();
});

function updateDropdown(){
  let existingList = document.querySelector('.recent-cities');
  if(existingList) existingList.remove();

  if(recentCities.length > 0){
  const list = document.createElement('ul');
  list.classList.add('recent-cities');
  
  recentCities.forEach(city => {
    const cityItem = document.createElement('li');
    cityItem.textContent = city;
    cityItem.addEventListener('click', ()=>{
      searchCity.value = city;
      showWeatherData(city);
    });
    list.appendChild(cityItem);
  });
  
  const clearAll = document.createElement('li');
    clearAll.textContent = 'Clear All';
    clearAll.classList.add('text-sm');
    clearAll.addEventListener('click', () => {
      recentCities = [];
      localStorage.removeItem('recentCities');
      updateDropdown();
      location.reload();
    });
    list.appendChild(clearAll);
  document.getElementById('search-container').appendChild(list);
  }
}

// Hide Dropdown on Outside click
document.addEventListener('click', ()=>{
  const dropdown = document.querySelector('.recent-cities');
  if(dropdown) dropdown.remove();
});
  