import { useStore } from '../../store';

const Home = () => {
  const handleLogout = useStore(state => state.handleLogout);

  return (
    <>
      <h1>Home</h1>

      <button onClick={() => handleLogout()}>Log out</button>
    </>
  );
};

export default Home;
