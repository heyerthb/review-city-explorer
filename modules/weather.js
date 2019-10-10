function getForecasts(latitude, longitude, client, superagent){

//  call a getStoredWeather and find out if there is weather stored
  return getStoredWeather(query, client)
    .then( weatherData =>{
      if (weatherData){
        return weather
      } else {
        return getWeatherFromAPI(query, client, superagent);
      }
    })

// if data there is data stored -- return the stored data

// if data is not stored -- get it from api
 
  const URL = `https://api.darksky.net/forecast/${process.env.DARK_SKY_API}/${query.data.latitude}.${query.data.longitude}`
  return superagent
    .get(URL)
    .then(response => response.body.daily.data)
    .then(days => days.map(day => new Weather (day)))

}

function getWeatherFromAPI(query, client, superagent)
function Weather (dayData){
  this.forecast = dayData.summary;
  this.time = new Date(dayData.time * 1000).toString().slice(0,15);
}

module.exports = getForecasts;