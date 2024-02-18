import { BarChart } from '@mantine/charts';
import { useEffect, useState } from 'react';
import { Chip, Group, Paper } from '@mantine/core';
import styles from './Charts.module.scss';
import { numberFormatOptions } from '../../../lib/constants.ts';

interface Props {
  title: string;
  totalCount?: number;
  primaryData: Record<string, string | number>[];
  secondaryData?: Record<string, string | number>[];
  helperMap?: Record<string, string>;
  xAxisHeight?: number;
  xAxisMargin?: number;
}

const FlightBarChart = ({
  title,
  primaryData,
  secondaryData,
  helperMap,
  totalCount,
  xAxisHeight = 40,
  xAxisMargin = 10,
}: Props) => {
  const [data, setData] = useState<Record<string, string | number>[]>([]);
  const [selectedData, setSelectedData] = useState<string>('count');
  const [width, setWidth] = useState<number>(1200);

  useEffect(() => {
    setData(primaryData);
  }, [primaryData]);

  useEffect(() => {
    if (!secondaryData || !primaryData) return;
    if (selectedData === 'count') {
      setData(primaryData);
    } else if (selectedData === 'distance') {
      setData(secondaryData);
    }
  }, [selectedData, primaryData, secondaryData]);

  useEffect(() => {
    setWidth(data.length <= 20 ? 1200 : Math.ceil(data.length / 10) * 450);
  }, [data]);

  return (
    <div className={styles.barChartContainer}>
      <header>
        <div>
          <h1>{title}</h1>
          <p>
            <b>{totalCount}</b> total {title}
          </p>
        </div>
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
        <BarChart
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
              const text = helperMap
                ? `${helperMap[item]}: ${formattedValue}`
                : `${item}: ${formattedValue}`;
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

export default FlightBarChart;
