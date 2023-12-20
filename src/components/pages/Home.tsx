import { useStore } from '../../store';
import { Button } from '@mantine/core';

const Home = () => {
  const handleLogout = useStore(state => state.handleLogout);

  return (
    <>
      <h1>Home</h1>

      <Button onClick={() => handleLogout()}>Log out</Button>
    </>
  );
};

export default Home;
