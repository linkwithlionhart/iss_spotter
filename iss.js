// Import the request library to make HTTP requests.
const request = require('request');

/** 
 * Fetches the user's IP address via an API request.
 * @param {function} callback - Callback to handle error or IP result.
 * @callback {Error|null} error - Potential error encountered.
 * @callback {string|null} ip - User's IP address or null on error.
 * @example IP: "162.245.144.188".
 */

const fetchMyIP  = function(callback) {
  // Use the request library to fetch the IP address from the ipify.org API in JSON format.
  request('https://api.ipify.org?format=json', (error, response, body) => {
    // If an error occurs during the request, pass it to the callback.
    if (error) {
      callback(error, null);
      return;
    }
    // If HTTP status code isn't OK (i.e., 200), pass error message to callback.
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP. Response: ${body}`), null);
      return;
    }
    // Parse the returned JSON body and extract IP.
    const ip = JSON.parse(body).ip;
    // Pass IP to the callback.
    callback(null, ip);
  });
};

/**
 * Fetches geolocation coordinates by IP address.
 * @param {string} ip - IP address for fetched coordinates.
 * @param {function} callback - Callback function handles response.
 */

const fetchCoordsByIP = function(ip, callback) {
  // Send a GET request to the 'ipwho.is' API with the provided IP address.
  request(`https://ipwho.is/${ip}`, (error, response, body) => {
    // If error with request, pass to callback.
    if (error) {
      callback(error, null);
      return;
    }
    // If response not ok, pass error message to callback.
    if (response.statusCode != 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`), null);
      return;
    }
    // When ok, parse the JSON data and extract coordinates.
    const parsedBody = JSON.parse(body);
    // Check the 'success' property of the parsed response.
    if (parsedBody.success === false) {
      const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
      callback(Error(message), null);
      return;
    }
    // Destructure the coordinates from the parsing.
    const { latitude, longitude } = parsedBody;
    // Validate the coordinate data.
    if (latitude && longitude) {
      // Pass coordinates as an object to callback.
      callback(null, { latitude, longitude });
    } else {
      callback(Error("Latitude and longitude not found in API response."), null);
    }
  });
};

/**
 * Fetch upcoming ISS flyover times for given coordinates
 * @param {Object} coords - Object with latitude and longitude properties. 
 * @param {function} callback - Callback function to handle the API response.
 * @returns {void} Calls the callback with two arguments:
 *  1. An error, if encountered (or null).
 *  2. An array of flyover times (or null if an error occurred).
 * @example
 * fetchISSFlyOverTimes({ latitude: '49.27670', longitude: '-123.13000' }, (error, passTimes) => { ... });
 */

const fetchISSFlyOverTimes = function(coords, callback) {
  // Construct URL with coordinates.
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;
  // Make GET request to URL.
  request(url, (error, response, body) => {
    // If error with request, pass to callback.
    if (error) {
      callback(error, null);
      return; 
    }
    // If response not ok, pass error message to callback.
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }
    // When ok, parse the JSON object.
    const data = JSON.parse(body);
    // If message not a success, handle the error.
    if (data.message !== "success") {
      callback(Error(`Failed to fetch ISS pass times: ${data.message}`), null);
      return;
    }
    // Return array of flyover times through callback.
    callback(null, data.response);
  })
};

/**
 * Fetches the next 5 upcoming ISS fly overs based on the user's location.
 * @param {function} callback - Handles error or fly over times.
 * @callback callback
 * @param {Error|null} error - Potential error encountered.
 * @param {Array<{risetime: number, duration: number}>|null} times - Fly-over times or null on error.
 */

const nextISSTimesForMyLocation = function(callback) {
  // Fetch user IP address.
  fetchMyIP((error, ip) => {
    // If error, return it to callback.
    if (error) {
      callback(error, null);
      return;
    }
    // Fetch coordinates for the fetched IP address.
    fetchCoordsByIP(ip, (error, coords) => {
      // If error, returns it to callback.
      if (error) {
        callback(error, null);
        return;
      }
      // Fetch the next ISS flyover times for the fetched coordinates.
      fetchISSFlyOverTimes(coords, (error, passTimes) => {
        // If error, return it to callback.
        if (error) {
          callback(error, null);
          return;
        }
        // If all API calls succeed, return flyover times to callback.
        callback(null, passTimes);
      });
    });
  });
};

// Make functions available to other modules.
module.exports = { 
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes,
  nextISSTimesForMyLocation,
};