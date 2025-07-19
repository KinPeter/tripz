import { useTripsApi } from '../../../hooks/useTripsApi';
import { formFlexProps, useFlightFormContext } from '../../../lib/flightFormTools';
import { Airline } from '../../../types';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { ActionIcon, Flex, Modal, NavLink, TextInput } from '@mantine/core';
import { IconPlaneTilt, IconSearch } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

export const AirlinesTab = () => {
  const form = useFlightFormContext();
  const { searchAirlines } = useTripsApi();
  const [opened, { open, close }] = useDisclosure(false);
  const [airlineOptions, setAirlineOptions] = useState<Airline[]>([]);
  const [loading, setLoading] = useState(false);

  const searchByIata = async () => {
    const iata = form.getValues().airline.iata;
    if (!iata) return;
    setLoading(true);
    try {
      const airlines = await searchAirlines(iata, null);
      if (airlines.length === 0) {
        notifications.show({
          color: 'red',
          title: 'No airline found',
          message: `No airline found for IATA code ${iata}`,
        });
        return;
      }
      if (airlines.length === 1) {
        onSelectItem(airlines[0]);
        return;
      }
      setAirlineOptions(airlines);
      open();
    } catch (error: unknown) {
      notifications.show({
        color: 'red',
        title: 'Error fetching airlines',
        message: JSON.stringify(error),
      });
    } finally {
      setLoading(false);
    }
  };

  const searchByName = async () => {
    const name = form.getValues().airline.name;
    if (!name) return;
    setLoading(true);
    try {
      const airlines = await searchAirlines(null, name);
      if (airlines.length === 0) {
        notifications.show({
          color: 'red',
          title: 'No airline found',
          message: `No airline found for name ${name}`,
        });
        return;
      }
      if (airlines.length === 1) {
        onSelectItem(airlines[0]);
        return;
      }
      setAirlineOptions(airlines);
      open();
    } catch (error: unknown) {
      notifications.show({
        color: 'red',
        title: 'Error fetching airlines',
        message: JSON.stringify(error),
      });
    } finally {
      setLoading(false);
    }
  };

  const onSelectItem = (airline: Airline) => {
    form.setFieldValue('airline.iata', airline.iata);
    form.setFieldValue('airline.icao', airline.icao);
    form.setFieldValue('airline.name', airline.name);
    close();
  };

  return (
    <>
      <Flex {...formFlexProps} align="end">
        <TextInput
          withAsterisk
          label="Airline"
          placeholder="IATA code, e.g. TK"
          key={form.key('airline.iata')}
          {...form.getInputProps('airline.iata')}
        />
        <ActionIcon variant="light" size="lg" onClick={searchByIata} loading={loading}>
          <IconSearch></IconSearch>
        </ActionIcon>
      </Flex>
      <Flex {...formFlexProps} align="end">
        <TextInput
          withAsterisk
          label="Name"
          placeholder=""
          key={form.key('airline.name')}
          {...form.getInputProps('airline.name')}
        />
        <ActionIcon variant="light" size="lg" onClick={searchByName} loading={loading}>
          <IconSearch></IconSearch>
        </ActionIcon>
      </Flex>
      <Flex {...formFlexProps} align="end">
        <TextInput
          withAsterisk
          label="ICAO"
          placeholder="e.g. THY"
          key={form.key('airline.icao')}
          {...form.getInputProps('airline.icao')}
        />
      </Flex>
      <Modal opened={opened} withCloseButton onClose={close} size="lg" radius="md">
        {airlineOptions.length > 0
          ? airlineOptions.map(airline => (
              <NavLink
                key={airline.icao + airline.name}
                href="#required-for-focus"
                label={`${airline.iata} - ${airline.name}`}
                leftSection={<IconPlaneTilt size={16} stroke={1.5} />}
                onClick={() => onSelectItem(airline)}
              />
            ))
          : null}
      </Modal>
    </>
  );
};
