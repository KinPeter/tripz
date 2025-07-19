import { useTripsApi } from '../../../hooks/useTripsApi';
import { formFlexProps, useFlightFormContext } from '../../../lib/flightFormTools';
import { Airport } from '../../../types';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { ActionIcon, Divider, Flex, NumberInput, TextInput } from '@mantine/core';
import { IconCalculator, IconSearch } from '@tabler/icons-react';
import { getDistanceInKm } from '../../../lib/mapUtils';

export const AirportsTab = () => {
  return (
    <>
      <Flex {...formFlexProps}>
        <AirportFields field="departureAirport" />
        <AirportFields field="arrivalAirport" />
      </Flex>
      <Divider my="lg" />
      <DistanceField />
    </>
  );
};

export const AirportFields = ({ field }: { field: 'departureAirport' | 'arrivalAirport' }) => {
  const form = useFlightFormContext();
  const { getAirport } = useTripsApi();
  const [loading, setLoading] = useState(false);

  const setFormValues = (airport: Airport) => {
    const { icao, name, city, country, lat, lng } = airport;
    form.setFieldValue(field + '.icao', icao);
    form.setFieldValue(field + '.name', name);
    form.setFieldValue(field + '.city', city);
    form.setFieldValue(field + '.country', country);
    form.setFieldValue(field + '.lat', lat);
    form.setFieldValue(field + '.lng', lng);
  };

  const getAirportData = async () => {
    const iata = form.getValues()[field].iata;
    if (!iata) return;
    setLoading(true);
    try {
      const airport = await getAirport(iata);
      if (!airport) {
        notifications.show({
          color: 'red',
          title: 'No airport found',
          message: `No airport found for IATA code ${iata}`,
        });
        return;
      }
      setFormValues(airport);
    } catch (error: unknown) {
      notifications.show({
        color: 'red',
        title: 'Error fetching airport',
        message: JSON.stringify(error),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Flex {...formFlexProps} align="end">
        <TextInput
          withAsterisk
          label={field === 'departureAirport' ? 'From' : 'To'}
          placeholder="IATA code, e.g. BUD"
          key={form.key(field + '.iata')}
          {...form.getInputProps(field + '.iata')}
        />
        <ActionIcon variant="light" size="lg" onClick={getAirportData} loading={loading}>
          <IconSearch></IconSearch>
        </ActionIcon>
      </Flex>

      <Flex {...formFlexProps}>
        <div>
          <TextInput
            withAsterisk
            label="City"
            placeholder=""
            key={form.key(field + '.city')}
            {...form.getInputProps(field + '.city')}
          />
          <TextInput
            withAsterisk
            label="Country"
            placeholder=""
            key={form.key(field + '.country')}
            {...form.getInputProps(field + '.country')}
          />
          <TextInput
            withAsterisk
            label="Airport name"
            placeholder=""
            key={form.key(field + '.name')}
            {...form.getInputProps(field + '.name')}
          />
        </div>
        <div>
          <NumberInput
            withAsterisk
            hideControls
            label="Latitude"
            placeholder=""
            key={form.key(field + '.lat')}
            {...form.getInputProps(field + '.lat')}
          />
          <NumberInput
            withAsterisk
            hideControls
            label="Longitude"
            placeholder=""
            key={form.key(field + '.lng')}
            {...form.getInputProps(field + '.lng')}
          />
          <TextInput
            withAsterisk
            label="ICAO"
            placeholder="ICAO code, e.g. LHBP"
            key={form.key(field + '.icao')}
            {...form.getInputProps(field + '.icao')}
          />
        </div>
      </Flex>
    </div>
  );
};

export const DistanceField = () => {
  const form = useFlightFormContext();

  const calculateDistance = () => {
    const { departureAirport, arrivalAirport } = form.getTransformedValues();
    if (
      !departureAirport.lat ||
      !departureAirport.lng ||
      !arrivalAirport.lat ||
      !arrivalAirport.lng
    )
      return;
    const distance = getDistanceInKm(
      departureAirport.lat,
      departureAirport.lng,
      arrivalAirport.lat,
      arrivalAirport.lng
    );
    form.setFieldValue('distance', distance);
  };

  return (
    <Flex {...formFlexProps} align="end">
      <TextInput
        withAsterisk
        label="Distance"
        placeholder=""
        key={form.key('distance')}
        {...form.getInputProps('distance')}
      />
      <ActionIcon variant="light" size="lg" onClick={calculateDistance}>
        <IconCalculator></IconCalculator>
      </ActionIcon>
    </Flex>
  );
};
