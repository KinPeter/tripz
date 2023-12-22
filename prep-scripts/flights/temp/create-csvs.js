import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

// Resolve the absolute path to the CSV file using __dirname
const airportPath = path.resolve(__dirname, '../airports.json');
const airlinesPath = path.resolve(__dirname, '../airlines.json');
const aircraftsPath = path.resolve(__dirname, '../aircrafts.json');
const flightsPath = path.resolve(__dirname, '../flights.json');
const flightsOutputPath = path.resolve(__dirname, '../flights.csv');
const aircraftsOutputPath = path.resolve(__dirname, '../aircrafts.csv');
const airlinesOutputPath = path.resolve(__dirname, '../airlines.csv');
const airportsOutputPath = path.resolve(__dirname, '../airports.csv');

try {
  // Read the json file synchronously
  const airportsInput = JSON.parse(fs.readFileSync(airportPath, 'utf-8'));
  const airlinesInput = JSON.parse(fs.readFileSync(airlinesPath, 'utf-8'));
  const aircraftsInput = JSON.parse(fs.readFileSync(aircraftsPath, 'utf-8'));
  const flightsInput = JSON.parse(fs.readFileSync(flightsPath, 'utf-8'));

  const airports = [
    ['id', 'user_id', 'city', 'country', 'name', 'iata', 'icao', 'lat', 'lng'].join(','),
    ...airportsInput.map(({ id, userId, city, country, name, iata, icao, lat, lng }) =>
      [id, userId, city, country, name, iata, icao, lat, lng].join(',')
    ),
  ].join('\n');

  fs.writeFileSync(airportsOutputPath, airports);

  const airlines = [
    ['id', 'user_id', 'name', 'iata', 'icao'].join(','),
    ...airlinesInput.map(({ id, userId, name, iata, icao }) =>
      [id, userId, name, iata, icao].join(',')
    ),
  ].join('\n');

  fs.writeFileSync(airlinesOutputPath, airlines);

  const aircrafts = [
    ['id', 'user_id', 'name', 'icao'].join(','),
    ...aircraftsInput.map(({ id, userId, name, icao }) => [id, userId, name, icao].join(',')),
  ].join('\n');

  fs.writeFileSync(aircraftsOutputPath, aircrafts);

  const flights = [
    [
      'id',
      'user_id',
      'date',
      'flight_number',
      'from',
      'to',
      'departure_time',
      'arrival_time',
      'duration',
      'distance',
      'airline',
      'aircraft',
      'registration',
      'seat_number',
      'seat_type',
      'flight_class',
      'flight_reason',
      'note',
    ].join(','),
    ...flightsInput.map(
      ({
        id,
        userId,
        date,
        flightNumber,
        from,
        to,
        departureTime,
        arrivalTime,
        duration,
        distance,
        airline,
        aircraft,
        registration,
        seatNumber,
        seatType,
        flightClass,
        flightReason,
        note,
      }) =>
        [
          id,
          userId,
          date,
          flightNumber,
          from,
          to,
          departureTime,
          arrivalTime,
          duration,
          distance,
          airline,
          aircraft,
          registration ?? '',
          seatNumber ?? '',
          seatType ?? '',
          flightClass ?? '',
          flightReason ?? '',
          note ?? '',
        ].join(',')
    ),
  ].join('\n');

  fs.writeFileSync(flightsOutputPath, flights);

  // Process the parsed CSV data here
  console.log('JSON file successfully processed');
} catch (error) {
  console.error('Error reading JSON file:', error.message);
}
