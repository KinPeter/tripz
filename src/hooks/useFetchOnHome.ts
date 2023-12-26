import { useFlightsApi } from './useFlightsApi.ts';
import { useVisitsApi } from './useVisitsApi.ts';
import { useStore } from '../store';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { notifications } from '@mantine/notifications';

export const useFetchOnHome = () => {
  const { getAllFlights } = useFlightsApi();
  const { getAllVisits } = useVisitsApi();
  const setFlights = useStore(s => s.setFlights);
  const setVisits = useStore(s => s.setVisits);

  const {
    isPending: flightsLoading,
    data: flightsData,
    error: flightsError,
  } = useQuery({
    queryKey: ['flights'],
    queryFn: getAllFlights,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const {
    isPending: visitsLoading,
    data: visitsData,
    error: visitsError,
  } = useQuery({
    queryKey: ['visits'],
    queryFn: getAllVisits,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (flightsData) {
      setFlights(flightsData);
    } else if (flightsError) {
      console.log(flightsError);
      notifications.show({
        title: 'Oops!',
        message: 'Could not fetch flights.',
        color: 'red',
      });
    }
  }, [flightsData, flightsError]);

  useEffect(() => {
    if (visitsData) {
      setVisits(visitsData);
    } else if (visitsError) {
      console.log(visitsError);
      notifications.show({
        title: 'Oops!',
        message: 'Could not fetch flights.',
        color: 'red',
      });
    }
  }, [visitsData, visitsError]);

  return { flightsLoading, visitsLoading };
};
