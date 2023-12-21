const fs = require('fs');
const path = require('path');

// Resolve the absolute path to the CSV file using __dirname
const filePath = path.resolve(__dirname, 'flights.csv');
const outputPath = path.resolve(__dirname, 'flightsRaw.json');

try {
  // Read the CSV file synchronously
  const data = fs.readFileSync(filePath, 'utf-8');

  // Split the data into lines
  const lines = data.split('\n');

  // Process the lines as needed
  const results = lines
    .map(line => {
      const values = line.split(',').map(value => {
        if (value.startsWith('"') && value.endsWith('"')) {
          return value.replaceAll(/"/g, '');
        } else {
          return value;
        }
      });
      return convert(values);
    })
    .slice(2)
    .filter(({ date }) => date);
  console.log(results[0]);

  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  // Process the parsed CSV data here
  console.log('CSV file successfully processed');
} catch (error) {
  console.error('Error reading CSV file:', error.message);
}

function convert(line) {
  return {
    date: line[0],
    flightNumber: line[1],
    from: parseAirport(line[2]),
    to: parseAirport(line[3]),
    departureTime: line[4],
    arrivalTime: line[5],
    duration: line[6],
    airline: parseAirline(line[7]),
    aircraft: parseAircraft(line[8]),
    registration: line[9],
    seatNumber: line[10],
    seatType: getSeatType(line[11]),
    flightClass: getFlightClass(line[12]),
    flightReason: getFlightReason(line[13]),
    note: line[14],
  };
}

function parseAirport(stringValue) {
  if (!stringValue) return {};
  const matches = stringValue.match(/^([^\/]+)\s*\/\s*([^(]+)\s*\(([^\/]+)\/([^)]+)\)$/);
  if (matches) {
    const [_, city, name, iata, icao] = matches;
    return { city: city.trim(), name: name.trim(), iata, icao };
  }
  return {};
}

function parseAirline(stringValue) {
  if (!stringValue) return {};
  const matches = stringValue.match(/^([^(]+)\s*\(([^\/]+)\/([^)]+)\)$/);
  if (matches) {
    const [_, name, iata, icao] = matches;
    return { name: name.trim(), iata, icao };
  }
  return {};
}

function parseAircraft(stringValue) {
  if (!stringValue) return {};
  const matches = stringValue.match(/^([^(]+)\s*\(([^)]+)\)$/);
  if (matches) {
    const [_, name, abbreviation] = matches;
    return { name: name.trim(), abbreviation };
  }
  return {};
}

function getSeatType(num) {
  if (Number(num) === 1) {
    return 'Window';
  } else if (Number(num) === 2) {
    return 'Middle';
  } else if (Number(num) === 3) {
    return 'Aisle';
  }
}

function getFlightClass(num) {
  if (Number(num) === 1) {
    return 'Economy';
  } else if (Number(num) === 2) {
    return 'Business';
  }
}

function getFlightReason(num) {
  if (Number(num) === 1) {
    return 'Leisure';
  } else if (Number(num) === 2) {
    return 'Business';
  }
}
