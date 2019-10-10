'use strict';

// environment variables

require ('dotenv').config();

// application dependencies

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');

// database setup

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('err', err => console.error(err));

// application setup

const app = express();
const PORT = process.env.PORT;
app.use(cors());

// ROUTES

app.get('/location', handleLocation);
app.get('/weather', handleWeather);
app.get('/events', handleEvents);

// INTERNAL MODULES

const getLocation = require('/modules/location.js');
const getWeather = require('/modules/weather.js');
const getEvents = require('./modules.events');
// const getMovies = require('./modules/events');


// ROUTE HANDLERS

function handleLocation(req, res){

  getLocation(req.query.data, client, superagent)
    .then(location => res.send(location))
    .catch(err => handleError(err, res))
}

function handleWeather(req, res){

  getWeather(req.query.data, client, superagent)
  .then(data => res.send(data))
  .catch(err => handleError(err, res))
}

function handleEvents(req, res){

  getEvents(req.query.data.formatted_address_query, client, superagent)
  .then(data => res.send(data))
  .catch(err => handleError(err, res))
}

// get data functions



function getWeather(query, res){
  const URL = `https://api.darksky.net/forecast/${process.env.DARK_SKY_API}/${query.data.latitude}.${query.data.longitude}`
  return superagent.get(URL)
  .then(res => res.body.daily.data.map(day => new Weather(day)))
}

function getEvents(query, res){
  let URL = `https://www.eventbriteapi.com/v3/events/search?location.address=${query}&location.within=1km`
  return superagent.get(URL)
  .set('Authorization', `Bearer ${process.env.EVENT_BRITE}`)
  .then(data => data.body.events.map(event => new Event(event)))
}

// constructor functions

function Location(query, geoData){
  this.search_query = query;
  this.formatted_query = geoData.formatted_address;
  this.latitude = geoData.geometry.location.lat;
  this.longitude = geoData.geometry.location.lng;
}

function Weather(dayData){
  this.forecast = dayData.summary;
  this.time = new Date(dayData.time * 1000).toString().slice(0, 15);
}

function Event(event){
  this.link = event.url;
  this.name = event.name.text;
  this.event_date = event.start.local;
  this.summary = event.summary;
}

function handleError(error, response){
  console.error(error);
  response.status(500).send('ERROR');
}

app.listen(PORT, () => console.log(`App is lisitng on ${PORT}`));