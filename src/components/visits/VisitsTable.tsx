import { useEffect } from 'react';
import { useVisitTableData } from '../../hooks/useVisitTableData.ts';
import { Button, Table } from '@mantine/core';
import { VisitWithPosition } from '../../types/visits.ts';
import styles from './VisitsTable.module.scss';
import { useReducedTableData } from '../../hooks/useReducedTableData.ts';
import TableActions from '../misc/TableActions.tsx';

const VisitsTable = ({ searchQuery }: { searchQuery: string }) => {
  const { tableData, search } = useVisitTableData();
  const { reducedTableData, hasMore, loadMore } = useReducedTableData<VisitWithPosition>(tableData);

  useEffect(() => {
    search(searchQuery);
  }, [searchQuery]);

  const rows = reducedTableData.map((v: VisitWithPosition) => (
    <Table.Tr key={v.id}>
      <Table.Td>{v.position}</Table.Td>
      <Table.Td>{v.city}</Table.Td>
      <Table.Td>{v.country}</Table.Td>
      <Table.Td>{v.year}</Table.Td>
      <Table.Td>{v.lat}</Table.Td>
      <Table.Td>{v.lng}</Table.Td>
      <Table.Td>
        <TableActions item={v} dataType="visits" />
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div className={styles.tableContainer}>
      <Table.ScrollContainer minWidth={700} type="native">
        <Table striped highlightOnHover withRowBorders={false} verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>#</Table.Th>
              <Table.Th>City</Table.Th>
              <Table.Th>Country</Table.Th>
              <Table.Th>Year</Table.Th>
              <Table.Th>Latitude</Table.Th>
              <Table.Th>Longitude</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows}
            {hasMore ? (
              <Table.Tr>
                <Table.Td colSpan={14} className={styles.loadMoreContainer}>
                  <Button variant="subtle" onClick={loadMore}>
                    Load more...
                  </Button>
                </Table.Td>
              </Table.Tr>
            ) : null}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </div>
  );
};

export default VisitsTable;
