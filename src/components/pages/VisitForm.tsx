import styles from './VisitForm.module.scss';
import PageHeader from '../misc/PageHeader.tsx';
import { useNavigate, useParams } from 'react-router-dom';
import { yupResolver } from 'mantine-form-yup-resolver';
import {
  transformVisitValues,
  useVisitForm,
  VisitFormProvider,
  visitFormSchema,
  visitInitialValues,
} from '../../lib/visitFormTools.ts';
import { useMutation } from '@tanstack/react-query';
import { FormEvent, useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import { useVisitsApi } from '../../hooks/useVisitsApi.ts';
import { useStore } from '../../store';
import { Button, Divider, Flex, Loader, NumberInput, TextInput } from '@mantine/core';
import { formFlexProps } from '../../lib/flightFormTools.ts';
import { MapContainer } from 'react-leaflet';
import VisitFormMap from '../visits/VisitFormMap.tsx';
import { LatLng } from 'leaflet';
import { useProxyApi } from '../../hooks/useProxyApi.ts';

const VisitForm = ({ isNew }: { isNew: boolean }) => {
  const { visitId } = useParams();
  const navigate = useNavigate();
  const { createVisit, updateVisit } = useVisitsApi();
  const { getCity } = useProxyApi();
  const visits = useStore(s => s.visits);

  const form = useVisitForm({
    mode: 'uncontrolled',
    initialValues: visitInitialValues,
    validate: yupResolver(visitFormSchema),
    validateInputOnBlur: true,
    transformValues: transformVisitValues,
  });

  const {
    mutate: startCreateVisit,
    data: createData,
    error: createError,
    isPending: createLoading,
  } = useMutation({
    mutationFn: () => createVisit(form.getTransformedValues()),
  });

  const {
    mutate: startUpdateVisit,
    data: updateData,
    error: updateError,
    isPending: updateLoading,
  } = useMutation({
    mutationFn: () => updateVisit(form.getTransformedValues(), visitId!),
  });

  const {
    mutate: fetchLocation,
    data: locationData,
    error: locationError,
    isPending: locationLoading,
  } = useMutation({
    mutationFn: () => {
      const { lat, lng } = form.getTransformedValues();
      return getCity(`${lat},${lng}`);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    form.validate();
    if (!form.isValid()) {
      return;
    }
    if (isNew) {
      startCreateVisit();
    } else if (!isNew && visitId) {
      startUpdateVisit();
    }
    form.onSubmit(() => {});
  };

  const handleNewPosition = (pos: LatLng) => {
    if (pos) {
      form.setFieldValue('lat', Number(pos.lat.toFixed(6)));
      form.setFieldValue('lng', Number(pos.lng.toFixed(6)));
      fetchLocation();
    }
  };

  useEffect(() => {
    if (!isNew && visits?.length && visitId) {
      const visit = visits.find(v => v.id === visitId);
      if (!visit) return;
      form.setValues(visit);
    }
  }, [visitId, isNew, visits]);

  useEffect(() => {
    if (createData) {
      navigate('/home');
      notifications.show({
        title: 'Great!',
        message: 'Your new visit is saved successfully.',
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
    if (locationData) {
      form.setFieldValue('city', locationData.city);
      form.setFieldValue('country', locationData.country);
    } else if (locationError) {
      notifications.show({
        title: 'Oops!',
        message: locationError.message,
        color: 'red',
      });
    }
  }, [locationData, locationError]);

  useEffect(() => {
    if (updateData) {
      navigate('/home');
      notifications.show({
        title: 'Great!',
        message: 'Your visit is saved successfully.',
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
      <PageHeader>{isNew ? 'New visit' : 'Edit visit'}</PageHeader>
      <div className={styles.form}>
        <VisitFormProvider form={form}>
          <form onSubmit={event => handleSubmit(event)}>
            <Flex {...formFlexProps}>
              <TextInput
                withAsterisk
                label="City"
                placeholder=""
                key={form.key('city')}
                {...form.getInputProps('city')}
              />
              <TextInput
                withAsterisk
                label="Country"
                placeholder=""
                key={form.key('country')}
                {...form.getInputProps('country')}
              />
            </Flex>
            <Flex {...formFlexProps}>
              <NumberInput
                withAsterisk
                hideControls
                label="Latitude"
                placeholder=""
                key={form.key('lat')}
                {...form.getInputProps('lat')}
              />
              <NumberInput
                withAsterisk
                hideControls
                label="Longitude"
                placeholder=""
                key={form.key('lng')}
                {...form.getInputProps('lng')}
              />
            </Flex>
            <Divider my="lg" />
            <MapContainer className={styles.map} center={[53, 0]} zoom={3} scrollWheelZoom={true}>
              <VisitFormMap
                onSetPosition={handleNewPosition}
                position={
                  isNew
                    ? undefined
                    : ({ lat: form.getValues().lat, lng: form.getValues().lng } as LatLng)
                }
              />
            </MapContainer>
            <Flex {...formFlexProps} justify="flex-end" my="xl" pb="xl">
              <Button type="submit">
                {createLoading || updateLoading || locationLoading ? (
                  <Loader color="white" size="sm" type="dots" />
                ) : (
                  'Save visit'
                )}
              </Button>
            </Flex>
          </form>
        </VisitFormProvider>
      </div>
    </div>
  );
};

export default VisitForm;
