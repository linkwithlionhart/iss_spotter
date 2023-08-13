const request = require('request-promise-native');

/**
 * Request user IP from https://www.ipify.org/
 * @return {Promise} - Promise for ip data request as JSON string.
 */

const fetchMyIP = () => {
  return request('https://api.ipify.org?format=json');
};

/**
 * Fetch geographical coordinates (latitude and longitude) for a given IP address.
 * @param {string} body - JSON string containing the IP address.
 * @returns {Promise} Promise of request for latitude and longitude.
 */

const fetchCoordsByIP = body => {
  const ip = JSON.parse(body).ip;
  return request(`http://ipwho.is/${ip}`);
};

/**
 * Fetch flyover times from https://iss-flyover.herokuapp.com using lat/long data
 * @param {Promise} body - JSON body containing geo data from ipwho.is.
 * @returns {Promise} Promise of request for fly over data, returned as JSON string.
 */

const fetchISSFlyOverTimes = body => {
  const { latitude, longitude } = JSON.parse(body);
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`;
  return request(url);
};

/**
 * Chains three function calls and returns the fly over data from users location.
 * @returns {Promise} Promise for fly over data from users location.
 */

const nextISSTimesForMyLocation = () => {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const { response } = JSON.parse(data);
      return response;
    });
};

module.exports = { fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes,
  nextISSTimesForMyLocation
 };