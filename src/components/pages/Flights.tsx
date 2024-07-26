import styles from './Flights.module.scss';
import FlightsTable from '../flights/FlightsTable.tsx';
import PageHeader from '../misc/PageHeader.tsx';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import FlightSearchHelp from '../flights/FlightSearchHelp.tsx';
import { ActionIcon, Button, TextInput } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

const Flights = () => {
  const isWide = useMediaQuery('(min-width: 650px)');

  return (
    <div className={styles.container}>
      <PageHeader>My Flights</PageHeader>
      <div className={styles.menuBar}>
        {isWide ? (
          <Button leftSection={<IconPlus size={16} />} size="md" variant="filled">
            New flight
          </Button>
        ) : (
          <ActionIcon size="lg" variant="filled">
            <IconPlus size={20} />
          </ActionIcon>
        )}
        <TextInput
          size="md"
          w={400}
          mx={12}
          leftSection={<IconSearch size={16} />}
          placeholder="Search or filter"
        />
        <FlightSearchHelp></FlightSearchHelp>
      </div>
      <FlightsTable></FlightsTable>
    </div>
  );
};

export default Flights;
