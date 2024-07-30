import styles from './Map.module.scss';
import { ActionIcon, NativeSelect, Tooltip } from '@mantine/core';
import { useStore } from '../../store';
import { ChangeEvent, useState } from 'react';
import { IconCalendar, IconX } from '@tabler/icons-react';

const YearFilter = () => {
  const filterFlights = useStore(s => s.filterFlights);
  const filterVisits = useStore(s => s.filterVisits);
  const years = useStore(s => s.years);
  const selectOptions = ['All years', ...years];
  const [selectValue, setSelectValue] = useState<string>('All years');
  const [open, setOpen] = useState<boolean>(false);

  const onSelectYear = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    filterFlights(value);
    filterVisits(value);
    setSelectValue(value);
  };

  return (
    <div className={styles.filterButton}>
      <Tooltip position="bottom" label="Year filter">
        <ActionIcon
          onClick={() => setOpen(!open)}
          variant={open ? 'light' : 'outline'}
          size="lg"
          radius="xl"
          aria-label="Year filter"
        >
          {open ? <IconX /> : <IconCalendar />}
        </ActionIcon>
      </Tooltip>

      {open && (
        <div className={styles.content}>
          <NativeSelect
            data={selectOptions}
            value={selectValue}
            onChange={onSelectYear}
            size="sm"
          />
        </div>
      )}
    </div>
  );
};

export default YearFilter;
