import { useStore } from '../store';
import { useState } from 'react';
import { Visit } from '@kinpeter/pk-common';
import { VisitWithPosition } from '../types/visits.ts';

function sortByDate(a: Visit, b: Visit): number {
  const timestampA = Date.parse(a.createdAt as unknown as string);
  const timestampB = Date.parse(b.createdAt as unknown as string);
  return timestampB - timestampA;
}

function addPosition(v: Visit, index: number, visits: Visit[]): VisitWithPosition {
  return { ...v, position: visits.length - index };
}

export const useVisitTableData = () => {
  const visits = useStore(s => s.visits);
  const [tableData, setTableData] = useState([...visits].sort(sortByDate).map(addPosition));

  const search = (rawQuery: string) => {
    if (!rawQuery) {
      setTableData([...visits].sort(sortByDate).map(addPosition));
    } else {
      const query = rawQuery.trim().toLowerCase();
      setTableData(
        [...visits]
          .filter(
            ({ city, country }) =>
              city.toLowerCase().includes(query) || country.toLowerCase().includes(query)
          )
          .sort(sortByDate)
          .map(addPosition)
      );
    }
  };

  return {
    tableData,
    search,
  };
};
