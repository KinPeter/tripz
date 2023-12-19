import { Outlet, useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import { useEffect } from 'react';

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const isAuthenticated = useStore(state => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  return <Outlet />;
};

export default ProtectedRoute;
