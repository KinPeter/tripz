import styles from './Stats.module.scss';
import { useStore } from '../../store';
import { useFlightCharts } from '../../hooks/useFlightCharts.ts';
import FlightDonutChart from './charts/FlightDonutChart.tsx';
import StatsMainRow from './StatsMainRow.tsx';

const Stats = () => {
  const flights = useStore(s => s.statsFlightData);
  const visits = useStore(s => s.statsVisitsData);

  const { continents, classes, reasons, seatTypes } = useFlightCharts(flights);

  return (
    <div className={styles.container}>
      <StatsMainRow flights={flights} visits={visits} />
      <div className={styles.donutRow}>
        <FlightDonutChart title={'Flight class'} data={classes} />
        <FlightDonutChart title={'Flight reason'} data={reasons} />
        <FlightDonutChart title={'Seat type'} data={seatTypes} />
        <FlightDonutChart title={'Continents'} data={continents} />
      </div>
    </div>
  );
};

export default Stats;
