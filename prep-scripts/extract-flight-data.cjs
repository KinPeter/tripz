const fs = require('fs');
const path = require('path');

// Resolve the absolute path to the CSV file using __dirname
const inputPath = path.resolve(__dirname, 'flightsRaw.json');
const flightsPath = path.resolve(__dirname, 'flights.json');
const airportsPath = path.resolve(__dirname, 'airports.json');
const aircraftsPath = path.resolve(__dirname, 'aircrafts.json');
const airlinesPath = path.resolve(__dirname, 'airlines.json');

try {
  // Read the json file synchronously
  const data = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

  const flights = [];
  const airports = [];
  const aircrafts = [];
  const airlines = [];

  data.forEach(flight => {
    const fromExists = airports.find(({ iata }) => iata === flight.from.iata);
    const toExists = airports.find(({ iata }) => iata === flight.to.iata);
    const aircraftExists = aircrafts.find(
      ({ abbreviation }) => abbreviation === flight.aircraft.abbreviation
    );
    const airlineExists = airlines.find(({ iata }) => iata === flight.airline.iata);

    if (!fromExists) airports.push(flight.from);
    if (!toExists) airports.push(flight.to);
    if (!aircraftExists) aircrafts.push(flight.aircraft);
    if (!airlineExists) airlines.push(flight.airline);

    flights.push({
      ...flight,
      from: flight.from.iata,
      to: flight.to.iata,
      airline: flight.airline.iata,
      aircraft: flight.aircraft.abbreviation,
    });
  });

  fs.writeFileSync(flightsPath, JSON.stringify(flights, null, 2));
  fs.writeFileSync(airportsPath, JSON.stringify(airports, null, 2));
  fs.writeFileSync(airlinesPath, JSON.stringify(airlines, null, 2));
  fs.writeFileSync(aircraftsPath, JSON.stringify(aircrafts, null, 2));

  // Process the parsed CSV data here
  console.log('JSON file successfully processed');
} catch (error) {
  console.error('Error reading JSON file:', error.message);
}
