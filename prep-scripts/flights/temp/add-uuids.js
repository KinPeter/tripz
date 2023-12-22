import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuid } from 'uuid';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

// Resolve the absolute path to the CSV file using __dirname
const airportInputPath = path.resolve(__dirname, 'airportsWithCoords.json');
const airportOutputPath = path.resolve(__dirname, 'airportsWithIds.json');
const airlinesInputPath = path.resolve(__dirname, 'airlines.json');
const airlinesOutputPath = path.resolve(__dirname, 'airlinesWithIds.json');
const aircraftsInputPath = path.resolve(__dirname, 'aircrafts.json');
const aircraftsOutputPath = path.resolve(__dirname, 'aircraftsWithIds.json');

const userId = process.env.SUPABASE_USER_ID;

try {
  // Read the json file synchronously
  const airportsInput = JSON.parse(fs.readFileSync(airportInputPath, 'utf-8'));

  const airports = airportsInput.map(input => ({
    ...input,
    id: uuid(),
    userId,
  }));

  fs.writeFileSync(airportOutputPath, JSON.stringify(airports, null, 2));

  const airlinesInput = JSON.parse(fs.readFileSync(airlinesInputPath, 'utf-8'));

  const airlines = airlinesInput.map(input => ({
    ...input,
    id: uuid(),
    userId,
  }));

  fs.writeFileSync(airlinesOutputPath, JSON.stringify(airlines, null, 2));

  const aircraftsInput = JSON.parse(fs.readFileSync(aircraftsInputPath, 'utf-8'));

  const aircrafts = aircraftsInput.map(input => ({
    ...input,
    id: uuid(),
    userId,
  }));

  fs.writeFileSync(aircraftsOutputPath, JSON.stringify(aircrafts, null, 2));

  // Process the parsed CSV data here
  console.log('JSON file successfully processed');
} catch (error) {
  console.error('Error reading JSON file:', error.message);
}
