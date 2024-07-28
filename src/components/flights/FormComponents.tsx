import { ActionIcon, Flex, NumberInput, TextInput } from '@mantine/core';
import {
  findAircraftFromFlights,
  findAirlineFromFlights,
  findAirportFromFlights,
  formFlexProps,
  useFlightFormContext,
} from '../../lib/flightFormTools.ts';
import { IconCalculator, IconSearch } from '@tabler/icons-react';
import { getDistanceInKm } from '../../lib/mapUtils.ts';
import { useStore } from '../../store';
import { useProxyApi } from '../../hooks/useProxyApi.ts';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import { Airport, Airline } from '@kinpeter/pk-common';

export const AirportFields = ({ field }: { field: 'from' | 'to' }) => {
  const flights = useStore(s => s.flights);
  const form = useFlightFormContext();
  const { getAirport } = useProxyApi();

  const {
    mutate: startAirportQuery,
    data: airportData,
    error: airportError,
    isPending: airportLoading,
  } = useMutation({
    mutationFn: () => getAirport(form.getValues()[field].iata),
  });

  const setFormValues = (airport: Airport) => {
    const { icao, name, city, country, lat, lng } = airport;
    form.setFieldValue(field + '.icao', icao);
    form.setFieldValue(field + '.name', name);
    form.setFieldValue(field + '.city', city);
    form.setFieldValue(field + '.country', country);
    form.setFieldValue(field + '.lat', lat);
    form.setFieldValue(field + '.lng', lng);
  };

  const fetchAirportData = () => {
    const iata = form.getValues()[field].iata;
    const airportFromLocal = findAirportFromFlights(iata, flights);
    if (!airportFromLocal) {
      startAirportQuery();
      return;
    }
    setFormValues(airportFromLocal);
  };

  useEffect(() => {
    if (airportData) {
      setFormValues(airportData);
    } else if (airportError) {
      notifications.show({
        title: 'Oops!',
        message: airportError.message,
        color: 'red',
      });
    }
  }, [airportData, airportError]);

  return (
    <div>
      <Flex {...formFlexProps} align="end">
        <TextInput
          withAsterisk
          label={field === 'from' ? 'From' : 'To'}
          placeholder="IATA code, e.g. BUD"
          key={form.key(field + '.iata')}
          {...form.getInputProps(field + '.iata')}
        />
        <ActionIcon variant="light" size="lg" onClick={fetchAirportData} loading={airportLoading}>
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
    const { from, to } = form.getTransformedValues();
    if (!from.lat || !from.lng || !to.lat || !to.lng) return;
    const distance = getDistanceInKm(from.lat, from.lng, to.lat, to.lng);
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

export const AirlineFields = () => {
  const flights = useStore(s => s.flights);
  const form = useFlightFormContext();
  const { getAirline } = useProxyApi();

  const {
    mutate: startAirlineQuery,
    data: airlineData,
    error: airlineError,
    isPending: airlineLoading,
  } = useMutation({
    mutationFn: () => getAirline(form.getValues().airline.iata),
  });

  const setFormValues = (airline: Airline) => {
    const { icao, name } = airline;
    form.setFieldValue('airline.icao', icao);
    form.setFieldValue('airline.name', name);
  };

  const fetchAirlineData = () => {
    const iata = form.getValues().airline.iata;
    const airlineFromLocal = findAirlineFromFlights(iata, flights);
    if (!airlineFromLocal) {
      startAirlineQuery();
      return;
    }
    setFormValues(airlineFromLocal);
  };

  useEffect(() => {
    if (airlineData) {
      setFormValues(airlineData);
    } else if (airlineError) {
      notifications.show({
        title: 'Oops!',
        message: airlineError.message,
        color: 'red',
      });
    }
  }, [airlineData, airlineError]);

  return (
    <Flex {...formFlexProps} align="end">
      <TextInput
        withAsterisk
        label="Airline"
        placeholder="IATA code, e.g. TK"
        key={form.key('airline.iata')}
        {...form.getInputProps('airline.iata')}
      />
      <ActionIcon variant="light" size="lg" onClick={fetchAirlineData} loading={airlineLoading}>
        <IconSearch></IconSearch>
      </ActionIcon>
      <TextInput
        withAsterisk
        label="Name"
        placeholder=""
        key={form.key('airline.name')}
        {...form.getInputProps('airline.name')}
      />
      <TextInput
        withAsterisk
        label="ICAO"
        placeholder="e.g. THY"
        key={form.key('airline.icao')}
        {...form.getInputProps('airline.icao')}
      />
    </Flex>
  );
};

export const AircraftFields = () => {
  const flights = useStore(s => s.flights);
  const form = useFlightFormContext();

  const fetchAircraftData = () => {
    const icao = form.getValues().aircraft.icao;
    const aircraftFromLocal = findAircraftFromFlights(icao, flights);
    if (!aircraftFromLocal) return;
    const { name } = aircraftFromLocal;
    form.setFieldValue('aircraft.name', name);
  };

  return (
    <Flex {...formFlexProps} align="end">
      <TextInput
        withAsterisk
        label="Aircraft"
        placeholder="ICAO code, e.g. B748"
        key={form.key('aircraft.icao')}
        {...form.getInputProps('aircraft.icao')}
      />
      <ActionIcon variant="light" size="lg" onClick={fetchAircraftData}>
        <IconSearch></IconSearch>
      </ActionIcon>
      <TextInput
        withAsterisk
        label="Name"
        placeholder=""
        key={form.key('aircraft.name')}
        {...form.getInputProps('aircraft.name')}
      />
      <TextInput
        label="Registration"
        placeholder=""
        key={form.key('registration')}
        {...form.getInputProps('registration')}
      />
    </Flex>
  );
};
