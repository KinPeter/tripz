import { useFlightsApi } from './useFlightsApi.ts';
import { useVisitsApi } from './useVisitsApi.ts';
import { useStore } from '../store';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import { UUID } from '@kinpeter/pk-common';
import { usePublicTripzApi } from './usePublicTripzApi.ts';

interface Options {
  isPublic: boolean;
  userId?: UUID | null;
}

export const useFetchOnHome = ({ isPublic, userId }: Options) => {
  const { getAllFlights } = useFlightsApi();
  const { getAllVisits } = useVisitsApi();
  const { getAllTrips } = usePublicTripzApi();
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
    enabled: !isPublic,
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
    enabled: !isPublic,
  });

  const {
    isPending: publicLoading,
    data: publicData,
    error: publicError,
  } = useQuery({
    queryKey: ['public', userId],
    queryFn: () => getAllTrips(userId ?? ''),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: isPublic && !!userId,
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

  useEffect(() => {
    if (publicData) {
      setFlights(publicData.flights);
      setVisits(publicData.visits);
    } else if (publicError) {
      console.log(publicError);
      notifications.show({
        title: 'Oops!',
        message: 'Could not fetch trips.',
        color: 'red',
      });
    }
  }, [publicData, publicError]);

  return { flightsLoading, visitsLoading, publicLoading };
};
