const { nextISSTimesForMyLocation} = require('./iss_promised');
const { printPassTimes } = require('./printPassTimes');

/**
 * fetchMyIP()
  .then(fetchCoordsByIP)
  .then(fetchISSFlyOverTimes)
  .then(nextISSTimesForMyLocation)
  .then(body => console.log(body));
 */

  nextISSTimesForMyLocation()
    /**
     *  .then(passTimes => {
      passTimes.forEach(pass => {
      // Convert rise time from UNIX timestamp to readable data format.
      const dateTime = new Date(0);
      const duration = pass.duration;
      dateTime.setUTCSeconds(pass.risetime);
      console.log(`Next pass at ${dateTime} for ${duration} seconds!`);
      });
    })
     */  
    .then(printPassTimes)
    .catch(error => {
      console.log(`It didn't work: ${error.message}`);
    });
