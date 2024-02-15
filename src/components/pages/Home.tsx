import { Center, Loader } from '@mantine/core';
import { useFetchOnHome } from '../../hooks/useFetchOnHome.ts';
import Map from '../misc/Map.tsx';
import Stats from '../misc/Stats.tsx';

const Home = () => {
  const { flightsLoading, visitsLoading } = useFetchOnHome();

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
      <Stats />
    </>
  );
};

export default Home;
