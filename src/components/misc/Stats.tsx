import styles from './Stats.module.scss';
import { useStore } from '../../store';
import { useFlightCharts } from '../../hooks/useFlightCharts.ts';
import FlightDonutChart from './charts/FlightDonutChart.tsx';
import StatsMainRow from './StatsMainRow.tsx';
import FlightBarChart from './charts/FlightBarChart.tsx';

const Stats = () => {
  const flights = useStore(s => s.statsFlightData);
  const visits = useStore(s => s.statsVisitsData);

  const {
    continents,
    classes,
    reasons,
    seatTypes,
    airports,
    countries,
    routesByCount,
    routesByDistance,
    airlinesByCount,
    airlinesByDistance,
    aircraftsByCount,
    aircraftsByDistance,
  } = useFlightCharts(flights);

  return (
    <div className={styles.container}>
      <StatsMainRow flights={flights} visits={visits} />
      <div className={styles.donutRow}>
        <FlightDonutChart title={'Flight class'} data={classes} />
        <FlightDonutChart title={'Flight reason'} data={reasons} />
        <FlightDonutChart title={'Seat type'} data={seatTypes} />
        <FlightDonutChart title={'Continents'} data={continents} />
      </div>
      <FlightBarChart
        title="airports"
        totalCount={flights?.totalAirports}
        primaryData={airports}
        helperMap={flights?.airportsMap}
      />
      <FlightBarChart
        title="countries"
        totalCount={flights?.totalCountries}
        primaryData={countries}
        xAxisHeight={60}
        xAxisMargin={25}
      />
      <FlightBarChart
        title="airlines"
        totalCount={flights?.totalAirlines}
        primaryData={airlinesByCount}
        secondaryData={airlinesByDistance}
        helperMap={flights?.airlinesMap}
      />
      <FlightBarChart
        title="aircrafts"
        totalCount={flights?.totalAircrafts}
        primaryData={aircraftsByCount}
        secondaryData={aircraftsByDistance}
        helperMap={flights?.aircraftMap}
      />
      <FlightBarChart
        title="routes"
        totalCount={flights?.totalRoutes}
        primaryData={routesByCount}
        secondaryData={routesByDistance}
        xAxisHeight={50}
        xAxisMargin={20}
      />
    </div>
  );
};

export default Stats;