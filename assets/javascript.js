const key = 'a57b83109ef41fb4eeb270b54790b251';

const searchBtnEl = document.getElementById('searchBtn');
const searchInputEl = document.getElementById('citySearch');
const cityNameEl = document.getElementById('cityName');
const forecastRowEl = document.getElementById('forecastRow')

let history = [];
const init = () => {
    history = localStorage.getItem('citySearchHistory');
    if (history === null) {
        console.log('No search history');
        history = [];
    } else {
        history = JSON.parse(history);
        displayHistory();
    }

}


// Function to fetch wether data from API
const searchHandler = () => {
    const cityName = searchInputEl.value;
    cityNameEl.innerHTML = cityName;
    console.log(cityName);
    apiFetchCurrent(cityName)
    apiFetchForecast(cityName);
}

const historyBtnClick = (event) => {
    const btnEl = event.target;
    const cityName = btnEl.innerHTML;
    cityNameEl.innerHTML = cityName;
    apiFetchCurrent(cityName)
    apiFetchForecast(cityName);
}

const updateHistory = (city) => {
    for (let i = 0; i < history.length; i++) {
        const element = history[i];
        if (city === element) {
            history.splice(i, 1);
            history.unshift(element);
            localStorage.setItem('citySearchHistory', JSON.stringify(history))
            displayHistory()
        }
    }
    if (history[0] === city) {
        return;
    } else {
        history.unshift(city);
        localStorage.setItem('citySearchHistory', JSON.stringify(history))
        displayHistory();
    }
}

const apiFetchCurrent = (city) => {
    const apiURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + key + '&units=metric';
    fetch(apiURL)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            console.log(data)
            displayCurrentWeather(data)
        })
}


const apiFetchForecast = (city) => {
    const apiURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + key + '&units=metric';
    console.log(apiURL);
    updateHistory(city);
    fetch(apiURL)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            console.log(data)
            displayForecastWeather(data)
        })

}

const displayCurrentWeather = (data) => {
    const currentWeatherEl = document.getElementById('currentSection')
    const currentTempEl = document.getElementById('currentTemp')
    const currentWindEl = document.getElementById('currentWind')
    const currentHumidityEl = document.getElementById('currentHumidity')
    currentWeatherEl.style.visibility = 'visible'
    currentTempEl.innerHTML = data.main.temp + '&degC';
    currentWindEl.innerHTML = data.wind.speed + ' m/s';
    currentHumidityEl.innerHTML = data.main.humidity + '%';
}

const displayForecastWeather = (data) => {
    const arraydays = [7, 15, 23, 31, 39]
    forecastRowEl.innerHTML = '';
    for (let i = 0; i < arraydays.length; i++) {
        const element = arraydays[i]
        renderForecast(data.list[element])
    }
}

const renderForecast = (array) => {
    console.log(array)
    const forecastCardEl = document.createElement('section')
    const forecastDateEl = document.createElement('h5')
    const forecastTempEl = document.createElement('p')
    const forecastWindEl = document.createElement('p')
    const forecastHumidityEl = document.createElement('p')
    forecastCardEl.setAttribute('class', 'col-6 col-sm-4 col-md-3 col-lg-auto forecastCard')
    let date = dayjs.unix(array.dt).format('DD/MM/YYYY')
    forecastDateEl.innerHTML = date;
    forecastTempEl.innerHTML = 'Temp: ' + array.main.temp + '&degC';
    forecastWindEl.innerHTML = 'Wind: ' + array.wind.speed + ' m/s';
    forecastHumidityEl.innerHTML = 'Humidity: ' + array.main.humidity + '%';
    forecastCardEl.appendChild(forecastDateEl)
    forecastCardEl.appendChild(forecastTempEl)
    forecastCardEl.appendChild(forecastWindEl)
    forecastCardEl.appendChild(forecastHumidityEl)
    console.log(forecastCardEl)
    forecastRowEl.appendChild(forecastCardEl)
}

const displayHistory = () => {
    const historyListEl = document.getElementById('searchHistoryList');
    historyListEl.innerHTML = '';
    for (let i = 0; i < history.length; i++) {
        const element = history[i];
        const historyBtn = document.createElement('button');
        historyBtn.setAttribute('class', 'historyItem btn btn-secondary')
        historyBtn.innerHTML = element;
        historyListEl.appendChild(historyBtn);
    }
    const items = document.querySelectorAll('.historyItem')
    if (items) {
        console.log(items)
        items.forEach(item => {
            item.addEventListener('click', historyBtnClick)
        });
    }

}

//On clicking search, gets search input and fetches current weather and coords for 5 day weather forceast.
searchBtnEl.addEventListener('click', searchHandler)

init()