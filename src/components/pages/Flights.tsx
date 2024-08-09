import styles from './Flights.module.scss';
import FlightsTable from '../flights/FlightsTable.tsx';
import PageHeader from '../misc/PageHeader.tsx';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import FlightSearchHelp from '../flights/FlightSearchHelp.tsx';
import { ActionIcon, Button, TextInput } from '@mantine/core';
import { useDebouncedValue, useMediaQuery } from '@mantine/hooks';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Flights = () => {
  const isWide = useMediaQuery('(min-width: 650px)');
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState<string>('');
  const [searchTerm] = useDebouncedValue(inputValue, 500);

  return (
    <div className={styles.container}>
      <PageHeader>My Flights</PageHeader>
      <div className={styles.menuBar}>
        {isWide ? (
          <Button
            leftSection={<IconPlus size={16} />}
            size="md"
            variant="filled"
            onClick={() => navigate('/flights/new')}
          >
            New flight
          </Button>
        ) : (
          <ActionIcon size="lg" variant="filled" onClick={() => navigate('/flights/new')}>
            <IconPlus size={20} />
          </ActionIcon>
        )}
        <TextInput
          size="md"
          w={400}
          mx={12}
          leftSection={<IconSearch size={16} />}
          placeholder="Search or filter"
          value={inputValue}
          onChange={event => setInputValue(event.target.value)}
        />
        <FlightSearchHelp></FlightSearchHelp>
      </div>
      <FlightsTable filterExpression={searchTerm}></FlightsTable>
    </div>
  );
};

export default Flights;
