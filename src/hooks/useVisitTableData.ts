import { useStore } from '../store';
import { useState } from 'react';
import { VisitWithPosition, Visit } from '../types/visits.ts';

function sortByDate(a: Visit, b: Visit): number {
  const timestampA = new Date(a.year ? Number(a.year) : 1980, 0, 1).getTime();
  const timestampB = new Date(b.year ? Number(b.year) : 1980, 0, 1).getTime();
  return timestampB - timestampA;
}

function addPosition(v: Visit, index: number, visits: Visit[]): VisitWithPosition {
  return { ...v, position: visits.length - index };
}

export const useVisitTableData = () => {
  const visits = useStore(s => s.filteredVisits);
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
