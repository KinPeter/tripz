import Map from '../misc/Map.tsx';
import { Center, Loader } from '@mantine/core';
import { useFetchOnHome } from '../../hooks/useFetchOnHome.ts';

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
    </>
  );
};

export default Home;
