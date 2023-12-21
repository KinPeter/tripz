const fs = require('fs');
const path = require('path');

// Resolve the absolute path to the CSV file using __dirname
const inputPath = path.resolve(__dirname, 'airports.json');
const outputPath = path.resolve(__dirname, 'airportsWithCoords.json');

try {
  // Read the json file synchronously
  const data = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
  console.log(data.length);
  const airports = {};

  fs.writeFileSync(outputPath, JSON.stringify(airports, null, 2));

  // Process the parsed CSV data here
  console.log('JSON file successfully processed');
} catch (error) {
  console.error('Error reading JSON file:', error.message);
}
