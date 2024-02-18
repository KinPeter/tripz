import { AreaChart } from '@mantine/charts';
import { Paper } from '@mantine/core';
import styles from './Charts.module.scss';
import { useEffect, useState } from 'react';

interface Props {
  title: string;
  data: Record<string, string | number>[];
  xAxisHeight?: number;
  xAxisMargin?: number;
}

const FlightAreaChart = ({ title, data, xAxisHeight = 40, xAxisMargin = 10 }: Props) => {
  const [width, setWidth] = useState<number>(1200);

  useEffect(() => {
    setWidth(data.length <= 20 ? 1200 : Math.ceil(data.length / 10) * 450);
  }, [data]);

  return (
    <div className={styles.areaChartContainer}>
      <header>
        <h1>{title}</h1>
      </header>
      <main>
        <AreaChart
          data={data}
          dataKey="item"
          series={[{ name: 'value', color: 'tomato.6' }]}
          h={200}
          w={width}
          xAxisProps={{ angle: 45, height: xAxisHeight, tickMargin: xAxisMargin }}
          tooltipProps={{
            content: ({ payload }) => {
              if (!payload?.length) return null;
              const { item, value } = payload[0].payload;
              const text = `${item}: ${value}`;
              return (
                <Paper withBorder shadow="md" radius="md" px="md" py="sm">
                  {text}
                </Paper>
              );
            },
          }}
        />
      </main>
    </div>
  );
};

export default FlightAreaChart;
