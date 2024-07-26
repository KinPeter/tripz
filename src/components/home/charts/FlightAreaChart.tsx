import { AreaChart } from '@mantine/charts';
import { Chip, Group, Paper } from '@mantine/core';
import styles from './Charts.module.scss';
import { numberFormatOptions } from '../../../lib/constants.ts';
import { useChartPropsData } from '../../../hooks/useChartPropsData.ts';

interface Props {
  title: string;
  primaryData: Record<string, string | number>[];
  secondaryData?: Record<string, string | number>[];
  xAxisHeight?: number;
  xAxisMargin?: number;
}

const FlightAreaChart = ({
  title,
  primaryData,
  secondaryData,
  xAxisHeight = 40,
  xAxisMargin = 10,
}: Props) => {
  const { data, selectedData, setSelectedData, width } = useChartPropsData(
    primaryData,
    secondaryData
  );

  return (
    <div className={styles.areaChartContainer}>
      <header>
        <h1>{title}</h1>
        {secondaryData && (
          <div>
            <Chip.Group multiple={false} value={selectedData} onChange={setSelectedData}>
              <Group justify="center" gap={8}>
                <Chip size="xs" value="count">
                  Count
                </Chip>
                <Chip size="xs" value="distance">
                  Distance
                </Chip>
              </Group>
            </Chip.Group>
          </div>
        )}
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
              let formattedValue = Number(value).toLocaleString('hu-HU', numberFormatOptions);
              if (selectedData === 'distance') {
                formattedValue += ' km';
              }
              const text = `${item}: ${formattedValue}`;
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
