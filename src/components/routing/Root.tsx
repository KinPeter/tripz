import { Outlet } from 'react-router-dom';
import SystemMenu from '../misc/SystemMenu.tsx';

const Root = () => {
  return (
    <>
      <SystemMenu />
      <Outlet />
    </>
  );
};

export default Root;
