// Import the nextISSTimesForMyLocation function from iss module.
const { nextISSTimesForMyLocation } = require('./iss');

// Invoke the nextISSTimesForMyLocation function to get ISS flyover times.
nextISSTimesForMyLocation((error, passTimes) => {
  // If error, print to console.
  if (error) {
    console.error("It did not work:", error);
    return;
  }

  // Loop through each flyover time and print details.
  for (const pass of passTimes) {
    // Convert rise time from UNIX timestamp to readable data format.
    const dateTime = new Date(0);
    const duration = pass.duration;
    dateTime.setUTCSeconds(pass.risetime);
    console.log(`Next pass at ${dateTime} for ${duration} seconds!`);
  }
});