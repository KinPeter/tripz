import styles from './Visits.module.scss';
import PageHeader from '../misc/PageHeader.tsx';
import { useDebouncedValue, useMediaQuery } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ActionIcon, Button, TextInput } from '@mantine/core';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import VisitsTable from '../visits/VisitsTable.tsx';

const Visits = () => {
  const isWide = useMediaQuery('(min-width: 650px)');
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState<string>('');
  const [searchTerm] = useDebouncedValue(inputValue, 500);

  return (
    <div className={styles.container}>
      <PageHeader>My Visits</PageHeader>
      <div className={styles.menuBar}>
        {isWide ? (
          <Button
            leftSection={<IconPlus size={16} />}
            size="md"
            variant="filled"
            onClick={() => navigate('/visits/new')}
          >
            New visit
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
          placeholder="Search by city or country"
          value={inputValue}
          onChange={event => setInputValue(event.target.value)}
        />
      </div>
      <VisitsTable searchQuery={searchTerm} />
    </div>
  );
};

export default Visits;
