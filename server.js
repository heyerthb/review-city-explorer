'use strict';

require ('dotenv').config();

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');


const PORT = process.env.PORT;
const app = express();

app.use(cors());

app.get('/location', handleLocationRequest);
app.get('/weather', handleWeatherRequest);

app.listen(PORT, () => console.log('Listening on PORT', PORT));


function handleLocationRequest(request, response){
    // TODO: create the url for the geocode API
    // TODO: run a get request with superagent 
    // TODO: send the response from superagent
    const URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${request.query.data}&key=${process.env.GEO_API_KEY}`;
    // you can throw the url into a browser with your api key to make sure you're getting the data you want
    return superagent.get(URL)
    .then(res => {
        console.log('response from geocode api', res.body);
        const location = new Location(request.query.data, res.body);

        response.send(location);
      })
    .catch(error =>{
        handleError(error, response);
      })
}

function Location(query, rawData){
  //   this.query = query;
  //   this.formatted_query = geoData.formatted_address;
  //   this.latitude = geoData.geometry.location.lat;
  //   this.longitude = geoData.geometry.location.lng;

    this.query = query;
    this.formatted_query = rawData.results[0].formatted_address;
    this.latitude = rawData.results[0].geometry.location.lat;
    this.longitude = rawData.results[0].geometry.location.lng;
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
