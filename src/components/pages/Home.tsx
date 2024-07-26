import { Center, Loader } from '@mantine/core';
import { useFetchOnHome } from '../../hooks/useFetchOnHome.ts';
import Map from '../home/Map.tsx';
import Stats from '../home/Stats.tsx';
import { useParams } from 'react-router-dom';

interface Props {
  isPublic?: boolean;
}

const Home = ({ isPublic = false }: Props) => {
  const { userId } = useParams();
  const { flightsLoading, visitsLoading, publicLoading } = useFetchOnHome({ isPublic, userId });

  if ((!isPublic && (flightsLoading || visitsLoading)) || (isPublic && publicLoading)) {
    return (
      <Center h={'100vh'}>
        <Loader size="xl" type="bars" />
      </Center>
    );
  }

  return (
    <>
      <Map />
      <Stats isPublic={isPublic} />
    </>
  );
};

export default Home;
