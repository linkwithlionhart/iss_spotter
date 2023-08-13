// Import the nextISSTimesForMyLocation function from iss module.
const { nextISSTimesForMyLocation } = require('./iss');
const { printPassTimes } = require('./printPassTimes');

// Invoke the nextISSTimesForMyLocation function to get ISS flyover times.
nextISSTimesForMyLocation((error, passTimes) => {
  // If error, print to console.
  if (error) {
    console.error("It did not work:", error);
    return;
  }
  // Import printPassTimes function and pass passTimes data.
  printPassTimes(passTimes);
});