import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

// Resolve the absolute path to the CSV file using __dirname
const inputPath = path.resolve(__dirname, 'airports.json');
const outputPath = path.resolve(__dirname, 'airportsWithCoords.json');

(async () => {
  try {
    // Read the json file synchronously
    const data = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
    const airports = [];

    for (const apt of data) {
      const res = await fetch(
        `https://airlabs.co/api/v9/airports?iata_code=${apt.iata}&api_key=${process.env.AIRLABS_API_KEY}`
      );

      if (res.ok) {
        const json = await res.json();
        airports.push({
          ...apt,
          lat: json.response[0].lat,
          lng: json.response[0].lng,
        });
        console.log(`${apt.iata}: ${json.response[0].lat}, ${json.response[0].lng}`);
      } else {
        console.log('Could not get data for ' + apt.icao);
      }
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    // https://airlabs.co/api/v9/airports?iata_code=CDG&api_key=ade8445f-b1dd-46ab-96dc-4539e6f3710f

    fs.writeFileSync(outputPath, JSON.stringify(airports, null, 2));

    // Process the parsed CSV data here
    console.log('JSON file successfully processed');
  } catch (error) {
    console.error('Error reading JSON file:', error.message);
  }
})();
