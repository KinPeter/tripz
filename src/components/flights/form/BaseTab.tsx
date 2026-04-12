import { Checkbox, Flex, TextInput } from '@mantine/core';
import { formFlexProps, useFlightFormContext } from '../../../lib/flightFormTools';
import styles from './FormTabs.module.css';

export const BaseTab = () => {
  const form = useFlightFormContext();

  return (
    <>
      <Flex {...formFlexProps}>
        <TextInput
          withAsterisk
          label="Date"
          placeholder="YYYY-MM-DD"
          key={form.key('date')}
          {...form.getInputProps('date')}
        />
        <TextInput
          withAsterisk
          label="Flight number"
          placeholder="e.g. NB568"
          key={form.key('flightNumber')}
          {...form.getInputProps('flightNumber')}
        />
        <div className={styles.checkboxContainer}>
          <Checkbox
            label="Planned flight"
            key={form.key('isPlanned')}
            {...form.getInputProps('isPlanned', { type: 'checkbox' })}
          />
        </div>
      </Flex>
      <Flex {...formFlexProps}>
        <TextInput
          withAsterisk
          label="Departure time"
          placeholder="00:00:00"
          key={form.key('departureTime')}
          {...form.getInputProps('departureTime')}
        />
        <TextInput
          withAsterisk
          label="Arrival time"
          placeholder="00:00:00"
          key={form.key('arrivalTime')}
          {...form.getInputProps('arrivalTime')}
        />
        <TextInput
          withAsterisk
          label="Flight duration"
          placeholder="00:00:00"
          key={form.key('duration')}
          {...form.getInputProps('duration')}
        />
      </Flex>
    </>
  );
};
