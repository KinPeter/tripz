import { DonutChart, DonutChartCell } from '@mantine/charts';
import styles from './Charts.module.scss';

interface Props {
  title: string;
  data: DonutChartCell[];
}

const FlightDonutChart = ({ title, data }: Props) => {
  return (
    <div className={styles.donutContainer}>
      <div>
        <DonutChart
          strokeWidth={3}
          tooltipDataSource="segment"
          size={120}
          thickness={18}
          data={data}
        />
      </div>
      <div>
        <h1>{title}</h1>
        {data.map(({ name, value }) => (
          <p key={name}>
            <b>{value}</b> {name}
          </p>
        ))}
      </div>
    </div>
  );
};

export default FlightDonutChart;
