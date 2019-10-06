'use strict';

require ('dotenv').config();

const express = require('express');
const cors = require('cors');


const PORT = process.env.PORT;

const app = express();

app.use(cors());

app.get('/location', handleLocationRequest);
app.get('/weather', handleWeatherRequest);

app.listen(PORT, () => console.log('Listening on PORT', PORT));


function handleLocationRequest(request, response){
  try {
    const locationData = require('./data/geo.json');
      const location = new Location(request.query.data, locationData.results[0]);
      response.send(location);
  } catch (error){
    handleError(error, response);
  }
}

function Location(query, geoData){
    this.query = query;
    this.formatted_query = geoData.formatted_address;
    this.latitude = geoData.geometry.location.lat;
    this.longitude = geoData.geometry.location.lng;
}

function handleWeatherRequest(request, response){
  try {
    const data = require('./data/darksky.json');
    const daySummaries = [];
    data.daily.data.forEach(dayData => {
      daySummaries.push(new Weather(dayData));
  })
  response.send(daySummaries);
  } catch (error){
    handleError(error, response);
  }
}

function Weather(dayData){
  this.forecast = dayData.summary;
  this.time = new Date(dayData.time * 1000).toString().slice(0,15);
}

function handleError(error, response) {
  console.error(error);
  response.status(500).send('Ruh Roh')
}
