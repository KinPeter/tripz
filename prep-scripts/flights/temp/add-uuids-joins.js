import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuid } from 'uuid';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

// Resolve the absolute path to the CSV file using __dirname
const airportPath = path.resolve(__dirname, 'airports.json');
const airlinesPath = path.resolve(__dirname, 'airlines.json');
const aircraftsPath = path.resolve(__dirname, 'aircrafts.json');
const flightsInputPath = path.resolve(__dirname, 'flights.json');
const flightsOutputPath = path.resolve(__dirname, 'flightsWithIds.json');
const flightsBundleOutputPath = path.resolve(__dirname, 'flightsBundleWithIds.json');

const userId = process.env.SUPABASE_USER_ID;

try {
  // Read the json file synchronously
  const airports = JSON.parse(fs.readFileSync(airportPath, 'utf-8'));
  const airlines = JSON.parse(fs.readFileSync(airlinesPath, 'utf-8'));
  const aircrafts = JSON.parse(fs.readFileSync(aircraftsPath, 'utf-8'));
  const flightsInput = JSON.parse(fs.readFileSync(flightsInputPath, 'utf-8'));

  const flights = flightsInput.map(flight => {
    return {
      id: uuid(),
      userId,
      ...flight,
      from: airports.find(({ iata }) => iata === flight.from)?.id ?? 'error',
      to: airports.find(({ iata }) => iata === flight.to)?.id ?? 'error',
      airline: airlines.find(({ iata }) => iata === flight.airline)?.id ?? 'error',
      aircraft: aircrafts.find(({ icao }) => icao === flight.aircraft)?.id ?? 'error',
    };
  });

  const flightsBundle = flightsInput.map(flight => {
    return {
      id: uuid(),
      userId,
      ...flight,
      from: airports.find(({ iata }) => iata === flight.from) ?? 'error',
      to: airports.find(({ iata }) => iata === flight.to) ?? 'error',
      airline: airlines.find(({ iata }) => iata === flight.airline) ?? 'error',
      aircraft: aircrafts.find(({ icao }) => icao === flight.aircraft) ?? 'error',
    };
  });

  fs.writeFileSync(flightsOutputPath, JSON.stringify(flights, null, 2));
  fs.writeFileSync(flightsBundleOutputPath, JSON.stringify(flightsBundle, null, 2));

  // Process the parsed CSV data here
  console.log('JSON file successfully processed');
} catch (error) {
  console.error('Error reading JSON file:', error.message);
}
