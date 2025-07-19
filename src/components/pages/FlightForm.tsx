import styles from './FlightForm.module.scss';
import PageHeader from '../misc/PageHeader.tsx';
import { yupResolver } from 'mantine-form-yup-resolver';
import { Button, Flex, Loader, Tabs } from '@mantine/core';
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
import { useMutation } from '@tanstack/react-query';
import { useFlightsApi } from '../../hooks/useFlightsApi.ts';
import { notifications } from '@mantine/notifications';
import { BaseTab } from '../flights/form/BaseTab.tsx';
import { AirportsTab } from '../flights/form/AirportsTab.tsx';
import { AirlinesTab } from '../flights/form/AirlineTab.tsx';
import { AircraftTab } from '../flights/form/AircraftTab.tsx';
import { MiscTab } from '../flights/form/MiscTab.tsx';

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
            <Tabs defaultValue="base">
              <Tabs.List mb="xl">
                <Tabs.Tab value="base">Base</Tabs.Tab>
                <Tabs.Tab value="airports">Airports</Tabs.Tab>
                <Tabs.Tab value="airlines">Airlines</Tabs.Tab>
                <Tabs.Tab value="aircraft">Aircraft</Tabs.Tab>
                <Tabs.Tab value="misc">Misc</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="base">
                <BaseTab />
              </Tabs.Panel>
              <Tabs.Panel value="airports">
                <AirportsTab />
              </Tabs.Panel>
              <Tabs.Panel value="airlines">
                <AirlinesTab />
              </Tabs.Panel>
              <Tabs.Panel value="aircraft">
                <AircraftTab />
              </Tabs.Panel>
              <Tabs.Panel value="misc">
                <MiscTab />
              </Tabs.Panel>
            </Tabs>

            <Flex {...formFlexProps} justify="flex-end" my="xl" pb="xl">
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
