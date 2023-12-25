import Map from '../misc/Map.tsx';
import { useFlightsApi } from '../../hooks/useFlightsApi.ts';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Center, Loader } from '@mantine/core';
import { useVisitsApi } from '../../hooks/useVisitsApi.ts';

const Home = () => {
  const { getAllFlights } = useFlightsApi();
  const { getAllVisits } = useVisitsApi();

  const {
    isPending: flightsLoading,
    data: flightsData,
    error: flightsError,
  } = useQuery({
    queryKey: ['flights'],
    queryFn: getAllFlights,
  });

  const {
    isPending: visitsLoading,
    data: visitsData,
    error: visitsError,
  } = useQuery({
    queryKey: ['visits'],
    queryFn: getAllVisits,
  });

  useEffect(() => {
    if (flightsData) {
      console.log(flightsData);
    } else if (flightsError) {
      console.log(flightsError);
    }
  }, [flightsData, flightsError]);

  useEffect(() => {
    if (visitsData) {
      console.log(visitsData);
    } else if (visitsError) {
      console.log(visitsError);
    }
  }, [visitsData, visitsError]);

  if (flightsLoading || visitsLoading) {
    return (
      <Center h={'100vh'}>
        <Loader size="xl" type="bars" />
      </Center>
    );
  }

  return (
    <>
      <Map />
    </>
  );
};

export default Home;
