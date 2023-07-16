const key = 'a57b83109ef41fb4eeb270b54790b251';

const searchBtnEl = document.getElementById('searchBtn')
const searchInputEl = document.getElementById('citySearch')
const cityNameEl = document.getElementById('cityName')


// Function to fetch wether data from API
const searchHandler = () => {
    const cityName = searchInputEl.value;
    cityNameEl.innerHTML = cityName;
    console.log(cityName);
    const apiURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=' + key + '&units=metric';
    // const apiURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=' + key;
    console.log(apiURL);
    fetch(apiURL)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            console.log(data)
            displayWeather(data)
        })

}

// const forecastFetch = (coords) => {}
const displayWeather = (data) => {

}

//On clicking search, gets search input and fetches current weather and coords for 5 day weather forceast.
searchBtnEl.addEventListener('click', searchHandler)