import { StatsFlightData } from '../../types/flights.ts';
import { StatsVisitsData } from '../../types/visits.ts';
import styles from './Stats.module.scss';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { numberFormatOptions } from '../../lib/constants.ts';

interface Props {
  flights: StatsFlightData | null;
  visits: StatsVisitsData | null;
}

interface ConvertedStats {
  distanceKms: number | string;
  distanceMiles: number | string;
  distanceAroundTheGlobe: number | string;
  distanceToTheMoon: number | string;
  durationHours: number | string;
  durationMinutes: number | string;
  durationDays: number | string;
  durationWeeks: number | string;
  durationYears: number | string;
  yearWithMostFlights: [string, number];
  currentYear: number;
  lastYear: number;
}

const StatsMainRow = ({ flights, visits }: Props) => {
  const [convertedStats, setConvertedStats] = useState<ConvertedStats | undefined>();

  useEffect(() => {
    if (!flights) return;
    const options = numberFormatOptions;

    setConvertedStats({
      distanceKms: flights.totalDistance.toLocaleString('hu-HU', options),
      distanceMiles: Math.round(flights.totalDistance * 0.621371).toLocaleString('hu-HU', options),
      distanceAroundTheGlobe: (flights.totalDistance / 40075).toFixed(2),
      distanceToTheMoon: (flights.totalDistance / 384400).toFixed(2),
      durationDays: (flights.totalDurationMinutes / 60 / 24).toFixed(1),
      durationHours: Math.floor(flights.totalDurationMinutes / 60),
      durationMinutes: flights.totalDurationMinutes % 60,
      durationWeeks: (flights.totalDurationMinutes / 60 / 24 / 7).toFixed(1),
      durationYears: (flights.totalDurationMinutes / 60 / 24 / 365).toFixed(2),
      yearWithMostFlights: Object.entries(flights.flightsPerYear).sort((a, b) => b[1] - a[1])[0],
      currentYear: flights.flightsPerYear[new Date().getFullYear()],
      lastYear: flights.flightsPerYear[new Date().getFullYear() - 1] ?? 0,
    });
  }, [flights]);

  if (!flights || !visits || !convertedStats) return null;

  return (
    <div className={styles.mainRow}>
      <div>
        <p>
          <b>{flights.totalCount}</b> <Link to="/flights">flights</Link>
        </p>
        <p>
          <b>{flights.intlCount}</b> international
        </p>
        <p>
          <b>{flights.domesticCount}</b> domestic
        </p>
      </div>
      <div>
        <p>
          <b>{visits.citiesCount}</b> <Link to="/visits">places visited</Link>
        </p>
        <p>
          in <b>{visits.countriesCount}</b> countries
        </p>
        <p>
          on <b>{flights.continentsByCount.length}</b> continents
        </p>
      </div>
      <div>
        <p>
          <b>{convertedStats.distanceKms}</b> km <span>flown</span>
        </p>
        <p>
          <b>{convertedStats.distanceMiles}</b> miles
        </p>
        <p>
          <b>{convertedStats.distanceAroundTheGlobe}</b>x around the Earth
        </p>
        <p>
          <b>{convertedStats.distanceToTheMoon}</b>x to the Moon
        </p>
      </div>
      <div>
        <p>
          <b>{convertedStats.durationHours}</b> h <b>{convertedStats.durationMinutes}</b> min{' '}
          <span>in the air</span>
        </p>
        <p>
          <b>{convertedStats.durationDays}</b> days
        </p>
        <p>
          <b>{convertedStats.durationWeeks}</b> weeks
        </p>
        <p>
          <b>{convertedStats.durationYears}</b> years
        </p>
      </div>
      <div>
        <p>
          <b>{convertedStats.yearWithMostFlights[0]}</b>
        </p>
        <p>
          is the year with most flights: <b>{convertedStats.yearWithMostFlights[1]}</b>
        </p>
        <p>
          last year: <b>{convertedStats.lastYear}</b>
        </p>
        <p>
          current year: <b>{convertedStats.currentYear}</b>
        </p>
      </div>
    </div>
  );
};

export default StatsMainRow;
