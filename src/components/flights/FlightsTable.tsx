import { Button, Table, Tooltip } from '@mantine/core';
import { FlightClass } from '@kinpeter/pk-common';
import styles from './FlightsTable.module.scss';
import { numberFormatOptions } from '../../lib/constants.ts';
import { useEffect } from 'react';
import { useFlightTableData } from '../../hooks/useFlightTableData.ts';
import { FlightWithPosition } from '../../types/flights.ts';
import { useReducedTableData } from '../../hooks/useReducedTableData.ts';
import TableActions from '../misc/TableActions.tsx';

function getClass(value: FlightClass): 'C' | 'Y' | 'F' | 'W' {
  switch (value) {
    case FlightClass.BUSINESS:
      return 'C';
    case FlightClass.ECONOMY:
      return 'Y';
    case FlightClass.FIRST:
      return 'F';
    case FlightClass.PREMIUM_ECONOMY:
      return 'W';
  }
}

const FlightsTable = ({
  filterExpression,
  showPlanned,
}: {
  filterExpression: string;
  showPlanned: boolean;
}) => {
  const { tableData, filter, togglePlannedFlights } = useFlightTableData();
  const { reducedTableData, hasMore, loadMore } =
    useReducedTableData<FlightWithPosition>(tableData);

  useEffect(() => {
    filter(filterExpression);
  }, [filterExpression]);

  useEffect(() => {
    togglePlannedFlights(showPlanned);
  }, [showPlanned]);

  const rows = reducedTableData.map((f: FlightWithPosition) => (
    <Table.Tr key={f.id}>
      <Table.Td>{f.position}</Table.Td>
      <Table.Td>{f.date}</Table.Td>
      <Table.Td>{f.flightNumber}</Table.Td>
      <Table.Td>
        <Tooltip label={`${f.from.city} ${f.from.name}`}>
          <span>{f.from.iata}</span>
        </Tooltip>
      </Table.Td>
      <Table.Td>
        <Tooltip label={`${f.to.city} ${f.to.name}`}>
          <span>{f.to.iata}</span>
        </Tooltip>
      </Table.Td>
      <Table.Td>{f.departureTime.substring(0, 5)}</Table.Td>
      <Table.Td>{f.arrivalTime.substring(0, 5)}</Table.Td>
      <Table.Td
        align="right"
        pr="xl"
      >{`${Number(f.distance).toLocaleString('hu-HU', numberFormatOptions)} km`}</Table.Td>
      <Table.Td>
        <Tooltip label={f.airline.name}>
          <span>{f.airline.icao}</span>
        </Tooltip>
      </Table.Td>
      <Table.Td>
        <Tooltip label={f.aircraft.name}>
          <span>{f.aircraft.icao}</span>
        </Tooltip>
      </Table.Td>
      <Table.Td>{f.registration}</Table.Td>
      <Table.Td>
        <Tooltip label={f.seatType}>
          <span>{f.seatNumber}</span>
        </Tooltip>
      </Table.Td>
      <Table.Td>
        <Tooltip label={f.flightClass}>
          <span>{getClass(f.flightClass)}</span>
        </Tooltip>
      </Table.Td>
      <Table.Td>
        <TableActions dataType="flights" item={f} />
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div className={styles.tableContainer}>
      <Table.ScrollContainer minWidth={960} type="native">
        <Table striped highlightOnHover withRowBorders={false} verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>#</Table.Th>
              <Table.Th>Date</Table.Th>
              <Table.Th>Flight</Table.Th>
              <Table.Th>From</Table.Th>
              <Table.Th>To</Table.Th>
              <Table.Th>Dep.</Table.Th>
              <Table.Th>Arr.</Table.Th>
              <Table.Th align="right" maw="80">
                Dist.
              </Table.Th>
              <Table.Th>Airline</Table.Th>
              <Table.Th>Aircraft</Table.Th>
              <Table.Th>Reg.</Table.Th>
              <Table.Th>Seat</Table.Th>
              <Table.Th>Class</Table.Th>
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

export default FlightsTable;
