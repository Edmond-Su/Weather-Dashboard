const key = 'a57b83109ef41fb4eeb270b54790b251';
const searchBtnEl = document.getElementById('searchBtn');
const searchInputEl = document.getElementById('citySearch');
const cityNameEl = document.getElementById('cityName');
const forecastRowEl = document.getElementById('forecastRow')
let history = [];

// On initialisation grabs search history from local storage and assigns it to the history array
const init = () => {
    history = localStorage.getItem('citySearchHistory');
    // If no history in local storage then console logs it and resets the history array.
    // If there is history parses it and runs display history function
    if (history === null) {
        console.log('No search history');
        history = [];
    } else {
        history = JSON.parse(history);
        displayHistory();
    }

}


//Function to handle event listener on search button
const searchHandler = () => {
    // Gets input from search bar and assigns it to a variable
    const cityName = searchInputEl.value;
    if (cityName == '') {
        console.log('Search bar is empty')
    } else {
        // Renders searched city on screen
        cityNameEl.innerHTML = cityName;
        // Runs 2 API Fetch functions using the searched city name
        apiFetchCurrent(cityName);
        apiFetchForecast(cityName);
    }
}

//Function to handle clicks on history buttons
const historyBtnClick = (event) => {
    // Gets city name from button innerHTML and assigns it to a variable
    const btnEl = event.target;
    const cityName = btnEl.innerHTML;
    cityNameEl.innerHTML = cityName;
    // Runs 2 API Fetch functions using the button city name
    apiFetchCurrent(cityName);
    apiFetchForecast(cityName);
}

// Function to update the history array
const updateHistory = (city) => {
    // Loop to check if the city being searched is already in the history.
    for (let i = 0; i < history.length; i++) {
        const element = history[i];
        // If the city is in the history array, it is removed and then re-added to the beginning of the array
        // and the local storage is updated
        if (city === element) {
            history.splice(i, 1);
            history.unshift(element);
            localStorage.setItem('citySearchHistory', JSON.stringify(history))
            displayHistory()
        }
    }
    // If current city wasnt already in the history array and brought to front then it is added to the array
    // and local storage is updated
    if (history[0] === city) {
        return;
    } else {
        history.unshift(city);
        localStorage.setItem('citySearchHistory', JSON.stringify(history))
        displayHistory();
    }
}

// Function to fetch current weather for the currently searched city from the API and response is given to current weather display function
const apiFetchCurrent = (city) => {
    const apiURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + key + '&units=metric';
    fetch(apiURL)
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            if (data.cod == 200) {
                displayCurrentWeather(data)
                updateHistory(city);
            } else {
                renderError(data)
            }

        })

}

// Function to fetch 5 day forecast for the currently searched city from the API and response is given to forecast weather display function
const apiFetchForecast = (city) => {
    const apiURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + key + '&units=metric';
    fetch(apiURL)
        .then((response) => response.json())
        .then((data) => {
            if (data.cod == 200) {
                forecastWeatherHandler(data)
            }
        })

}

// Function to render error code and message on screen
const renderError = (data) => {
    const currentSectionEl = document.getElementById('currentSection')
    const forecastSectionEl = document.getElementById('forecastSection')
    const errorCodeEl = document.createElement('h2')
    const errorDescEl = document.createElement('h3')
    errorCodeEl.innerHTML = 'Error - ' + data.cod;
    if (data.cod == 401) {
        errorDescEl.innerHTML = 'Invalid API key'
    } else if (data.cod == 404) {
        errorDescEl.innerHTML = 'City not found.'
    } else {
        errorDescEl.innerHTML = 'Unknown error.'
    }
    currentSectionEl.style.visibility = 'hidden'
    forecastSectionEl.style.visibility = 'hidden'
    currentSectionEl.insertBefore(errorDescEl, currentSectionEl.firstChild)
    currentSectionEl.insertBefore(errorCodeEl, currentSectionEl.firstChild)
    errorCodeEl.setAttribute('id', 'errorCode')
    errorDescEl.setAttribute('id', 'errorDesc')
    errorCodeEl.style.visibility = 'visible';
    errorDescEl.style.visibility = 'visible';
}



// Function to use the given current weather data and display it on screen for user
const displayCurrentWeather = (data) => {
    // Removes error elements from DOM if there are any
    const errorCodeEl = document.getElementById('errorCode')
    const errorDescEl = document.getElementById('errorDesc')
    if (errorCodeEl) {
        errorCodeEl.remove()
        errorDescEl.remove()
    }
    // Assigns elements to variables and changes their inner html
    const currentWeatherEl = document.getElementById('currentSection')
    const currentCondImgEl = document.getElementById('condImg')
    const currentTempEl = document.getElementById('currentTemp')
    const currentWindEl = document.getElementById('currentWind')
    const currentHumidityEl = document.getElementById('currentHumidity')
    currentWeatherEl.style.visibility = 'visible'
    currentCondImgEl.setAttribute('src', 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png')
    currentTempEl.innerHTML = data.main.temp + '&degC';
    currentWindEl.innerHTML = data.wind.speed + ' m/s';
    currentHumidityEl.innerHTML = data.main.humidity + '%';
}

//Function to use the given forecast weather data and give specific array entries to a display function
const forecastWeatherHandler = (data) => {
    // These numbers are the array entries for noon of every day of the 5 day forecast
    const arraydays = [7, 15, 23, 31, 39]
    forecastRowEl.innerHTML = '';
    for (let i = 0; i < arraydays.length; i++) {
        const element = arraydays[i]
        DisplayForecast(data.list[element])
    }
}

// Function that uses given forecast data and displays it onscreen in a card for the user
const DisplayForecast = (array) => {
    const forecastSectionEl = document.getElementById('forecastSection')
    const forecastCardEl = document.createElement('section')
    const forecastDateEl = document.createElement('h5')
    const forecastCondImgEl = document.createElement('img')
    const forecastTempEl = document.createElement('p')
    const forecastWindEl = document.createElement('p')
    const forecastHumidityEl = document.createElement('p')
    forecastCardEl.setAttribute('class', 'col-6 col-sm-4 col-md-3 col-lg-auto forecastCard')
    let date = dayjs.unix(array.dt).format('DD/MM/YYYY')
    forecastDateEl.innerHTML = date;
    forecastCondImgEl.setAttribute('src', 'https://openweathermap.org/img/wn/' + array.weather[0].icon + '@2x.png')
    forecastTempEl.innerHTML = 'Temp: ' + array.main.temp + '&degC';
    forecastWindEl.innerHTML = 'Wind: ' + array.wind.speed + ' m/s';
    forecastHumidityEl.innerHTML = 'Humidity: ' + array.main.humidity + '%';
    forecastCardEl.appendChild(forecastDateEl)
    forecastCardEl.appendChild(forecastCondImgEl)
    forecastCardEl.appendChild(forecastTempEl)
    forecastCardEl.appendChild(forecastWindEl)
    forecastCardEl.appendChild(forecastHumidityEl)
    forecastRowEl.appendChild(forecastCardEl)
    forecastSectionEl.style.visibility = 'visible'
}

// Function that displays the search history on screen as buttons for the user
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
        items.forEach(item => {
            item.addEventListener('click', historyBtnClick)
        });
    }

}

//Adding event listener to the search button, which will run the searchHandler function on click
searchBtnEl.addEventListener('click', searchHandler)

// Calling the init function
init()