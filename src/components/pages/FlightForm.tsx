import styles from './FlightForm.module.scss';
import PageHeader from '../misc/PageHeader.tsx';
import { yupResolver } from 'mantine-form-yup-resolver';
import { Button, Checkbox, Divider, Flex, Loader, Select, TextInput } from '@mantine/core';
import {
  AircraftFields,
  AirlineFields,
  AirportFields,
  DistanceField,
} from '../flights/FormComponents.tsx';
import {
  FlightFormProvider,
  flightFormSchema,
  flightInitialValues,
  formFlexProps,
  transformFlightValues,
  useFlightForm,
} from '../../lib/flightFormTools.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { FormEvent, useEffect } from 'react';
import { useStore } from '../../store';
import { FlightClass, FlightReason, SeatType } from '../../types';
import { useMutation } from '@tanstack/react-query';
import { useFlightsApi } from '../../hooks/useFlightsApi.ts';
import { notifications } from '@mantine/notifications';

const FlightForm = ({ isNew }: { isNew: boolean }) => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const { createFlight, updateFlight } = useFlightsApi();
  const flights = useStore(s => s.flights);

  const form = useFlightForm({
    mode: 'uncontrolled',
    initialValues: flightInitialValues,
    validate: yupResolver(flightFormSchema),
    validateInputOnBlur: true,
    transformValues: transformFlightValues,
  });

  const {
    mutate: startCreateFlight,
    data: createData,
    error: createError,
    isPending: createLoading,
  } = useMutation({
    mutationFn: () => createFlight(form.getTransformedValues()),
  });

  const {
    mutate: startUpdateFlight,
    data: updateData,
    error: updateError,
    isPending: updateLoading,
  } = useMutation({
    mutationFn: () => updateFlight(form.getTransformedValues(), flightId!),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    form.validate();
    if (!form.isValid()) {
      return;
    }
    if (isNew) {
      startCreateFlight();
    } else if (!isNew && flightId) {
      startUpdateFlight();
    }
    form.onSubmit(() => {});
  };

  useEffect(() => {
    if (!isNew && flights?.length && flightId) {
      const flight = flights.find(flight => flight.id === flightId);
      if (!flight) return;
      form.setValues(flight);
    }
  }, [flightId, isNew, flights]);

  useEffect(() => {
    if (createData) {
      navigate('/home');
      notifications.show({
        title: 'Great!',
        message: 'Your new flight is saved successfully.',
        color: 'green',
      });
    } else if (createError) {
      notifications.show({
        title: 'Oops!',
        message: createError.message,
        color: 'red',
      });
    }
  }, [createData, createError, navigate]);

  useEffect(() => {
    if (updateData) {
      navigate('/home');
      notifications.show({
        title: 'Great!',
        message: 'Your flight is saved successfully.',
        color: 'green',
      });
    } else if (updateError) {
      notifications.show({
        title: 'Oops!',
        message: updateError.message,
        color: 'red',
      });
    }
  }, [updateData, updateError, navigate]);

  return (
    <div className={styles.container}>
      <PageHeader>{isNew ? 'New Flight' : 'Edit flight'}</PageHeader>
      <div className={styles.form}>
        <FlightFormProvider form={form}>
          <form onSubmit={event => handleSubmit(event)}>
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
            <Divider my="lg" />
            <Flex {...formFlexProps}>
              <AirportFields field="departureAirport" />
              <AirportFields field="arrivalAirport" />
            </Flex>
            <Divider my="lg" />
            <DistanceField />
            <Divider my="lg" />
            <AirlineFields />
            <Divider my="lg" />
            <AircraftFields />
            <Divider my="lg" />
            <Flex {...formFlexProps}>
              <TextInput
                label="Seat number"
                placeholder="e.g. 21C"
                key={form.key('seatNumber')}
                {...form.getInputProps('seatNumber')}
              />
              <Select
                label="Seat type"
                data={[...Object.values(SeatType)]}
                key={form.key('seatType')}
                {...form.getInputProps('seatType')}
              />
              <Select
                label="Flight class"
                data={[...Object.values(FlightClass)]}
                key={form.key('flightClass')}
                {...form.getInputProps('flightClass')}
              />
              <Select
                label="Flight reason"
                data={[...Object.values(FlightReason)]}
                key={form.key('flightReason')}
                {...form.getInputProps('flightReason')}
              />
              <TextInput
                label="Note"
                placeholder=""
                key={form.key('note')}
                {...form.getInputProps('note')}
              />
            </Flex>
            <Flex {...formFlexProps} justify="flex-end" mb="xl" pb="xl">
              <Button type="submit">
                {createLoading || updateLoading ? (
                  <Loader color="white" size="sm" type="dots" />
                ) : (
                  'Save flight'
                )}
              </Button>
            </Flex>
          </form>
        </FlightFormProvider>
      </div>
    </div>
  );
};

export default FlightForm;
