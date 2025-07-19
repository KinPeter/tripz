import { ActionIcon, Modal, Flex, TextInput, NavLink } from '@mantine/core';
import { formFlexProps, useFlightFormContext } from '../../../lib/flightFormTools.ts';
import { IconPlaneTilt, IconSearch } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useTripsApi } from '../../../hooks/useTripsApi.ts';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { Aircraft } from '../../../types/flights.ts';

export const AircraftTab = () => {
  const form = useFlightFormContext();
  const [opened, { open, close }] = useDisclosure(false);
  const [aircraftOptions, setAircraftOptions] = useState<Aircraft[]>([]);
  const [loading, setLoading] = useState(false);
  const { searchAircrafts } = useTripsApi();

  const searchByIcao = async () => {
    const icao = form.getValues().aircraft.icao;
    if (!icao) return;
    setLoading(true);
    try {
      const aircrafts = await searchAircrafts(icao);
      if (aircrafts.length === 0) {
        notifications.show({
          color: 'red',
          title: 'No aircraft found',
          message: `No aircraft found for ICAO code ${icao}`,
        });
        return;
      }
      if (aircrafts.length === 1) {
        onSelectItem(aircrafts[0]);
        return;
      }
      setAircraftOptions(aircrafts);
      open();
    } catch (error: unknown) {
      notifications.show({
        color: 'red',
        title: 'Error fetching aircrafts',
        message: JSON.stringify(error),
      });
    } finally {
      setLoading(false);
    }
  };

  const searchByName = async () => {
    const name = form.getValues().aircraft.name;
    if (!name) return;
    setLoading(true);
    try {
      const aircrafts = await searchAircrafts(name);
      if (aircrafts.length === 0) {
        notifications.show({
          color: 'red',
          title: 'No aircraft found',
          message: `No aircraft found for name ${name}`,
        });
        return;
      }
      if (aircrafts.length === 1) {
        onSelectItem(aircrafts[0]);
        return;
      }
      setAircraftOptions(aircrafts);
      open();
    } catch (error: unknown) {
      notifications.show({
        color: 'red',
        title: 'Error fetching aircrafts',
        message: JSON.stringify(error),
      });
    } finally {
      setLoading(false);
    }
  };

  const onSelectItem = (aircraft: Aircraft) => {
    form.setFieldValue('aircraft.icao', aircraft.icao);
    form.setFieldValue('aircraft.name', aircraft.name);
    close();
  };

  return (
    <>
      <Flex {...formFlexProps} align="end">
        <TextInput
          withAsterisk
          label="Aircraft ICAO"
          placeholder="ICAO code, e.g. B748"
          key={form.key('aircraft.icao')}
          {...form.getInputProps('aircraft.icao')}
        />
        <ActionIcon variant="light" size="lg" onClick={searchByIcao} loading={loading}>
          <IconSearch></IconSearch>
        </ActionIcon>
      </Flex>
      <Flex {...formFlexProps} align="end">
        <TextInput
          withAsterisk
          label="Name"
          placeholder=""
          key={form.key('aircraft.name')}
          {...form.getInputProps('aircraft.name')}
        />
        <ActionIcon variant="light" size="lg" onClick={searchByName} loading={loading}>
          <IconSearch></IconSearch>
        </ActionIcon>
      </Flex>
      <Flex>
        <TextInput
          label="Registration"
          placeholder=""
          key={form.key('registration')}
          {...form.getInputProps('registration')}
        />
      </Flex>
      <Modal opened={opened} withCloseButton onClose={close} size="lg" radius="md">
        {aircraftOptions.length > 0
          ? aircraftOptions.map(aircraft => (
              <NavLink
                key={aircraft.icao + aircraft.name}
                href="#required-for-focus"
                label={`${aircraft.icao} - ${aircraft.name}`}
                leftSection={<IconPlaneTilt size={16} stroke={1.5} />}
                onClick={() => onSelectItem(aircraft)}
              />
            ))
          : null}
      </Modal>
    </>
  );
};
