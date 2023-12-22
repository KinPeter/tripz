import airports from '../airports.json' assert { type: 'json' };
import flights from './flightsWithIds.json' assert { type: 'json' };

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const outputPath = path.resolve(__dirname, '../flights.json');

const flightsWithDistances = flights.map(flight => {
  const from = airports.find(({ id }) => id === flight.from);
  const to = airports.find(({ id }) => id === flight.to);
  const distance = getDistanceInKm(from.lat, from.lng, to.lat, to.lng);
  return {
    ...flight,
    distance,
  };
});

fs.writeFileSync(outputPath, JSON.stringify(flightsWithDistances, null, 2));

function getDistanceInKm(lat1, lng1, lat2, lng2) {
  const r = 6371; // km
  const p = Math.PI / 180;

  const a =
    0.5 -
    Math.cos((lat2 - lat1) * p) / 2 +
    (Math.cos(lat1 * p) * Math.cos(lat2 * p) * (1 - Math.cos((lng2 - lng1) * p))) / 2;

  return Math.floor(2 * r * Math.asin(Math.sqrt(a)));
}
