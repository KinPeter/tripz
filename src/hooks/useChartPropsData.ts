import { useEffect, useState } from 'react';

export const useChartPropsData = (
  primaryData: Record<string, string | number>[],
  secondaryData?: Record<string, string | number>[]
) => {
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

  return {
    data,
    selectedData,
    setSelectedData,
    width,
  };
};
