import { useEffect, useState } from 'react';

export function useReducedTableData<T>(tableData: T[]) {
  const [reducedTableData, setReducedTableData] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(tableData.length > 15);
  const [currentEndIndex, setCurrentEndIndex] = useState<number>(15);

  useEffect(() => {
    if (tableData.length > 15) {
      setReducedTableData(tableData.slice(0, 15));
      setHasMore(true);
    } else {
      setReducedTableData(tableData);
      setHasMore(false);
    }
    setCurrentEndIndex(15);
  }, [tableData]);

  const loadMore = () => {
    const total = tableData.length;
    const newEndIndex = currentEndIndex + 15 < total ? currentEndIndex + 15 : total;
    setReducedTableData(tableData.slice(0, newEndIndex));
    setCurrentEndIndex(newEndIndex);
    setHasMore(newEndIndex < total);
  };

  return {
    reducedTableData,
    hasMore,
    loadMore,
  };
}
