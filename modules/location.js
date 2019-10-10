function getLocation(query, client, superagent){

    return getStoredLocation(query, client)
      .then(location => {
      if (location){
        return location;
      } else {
        return getLocationFromAPI(query, client, superagent);
  //         .then(location => cacheLocation(location));
      }
    });
  }
  function getStoredLocaion(query, client){

    const sql = `SELECT * FROM locations WHERE search_query='${query}'`;
    // 1) check for stored location
    return client
      .query(sql)
      .then(result => result.rows[0])
  }

  function getLocationFromAPI(query, client, superagent){
    
    const URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.GEO_API_KEY}`
    
    return superagent
    .get(URL)
    .then(response => new Location(query, response.body.results[0]))
    .then(location => cacheLocation(location, client));
  }

  function cacheLocation(location){
    const insertSQL = 
        `INSERT INTO locations (search_query, formatted_query, latitude, longitude) VALUES ('${location.search_query}', '${location.formatted_query}', '${location.latitude}', '${location.longitude}')`;
      return client.query(insertSQL).then(results => location);
  }

  function Location(query, geoData){
      this.search_query = query;
      this.formatted_query = geoData.formatted_address;
      this.latitude = geoData.geometry.location.lat;
      this.longitude = geoData.geometry.location.lng;
    }  

    module.exports = getLocation;