import './App.scss';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import Root from './components/routing/Root.tsx';
import Auth from './components/pages/Auth.tsx';
import ProtectedRoute from './components/routing/ProtectedRoute.tsx';
import Home from './components/pages/Home.tsx';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { MantineProvider } from '@mantine/core';
import { theme } from './lib/mantine.ts';
import { Notifications } from '@mantine/notifications';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route index element={<Auth />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Home />} />
      </Route>
    </Route>
  )
);

function App() {
  return (
    <MantineProvider theme={theme}>
      <Notifications />
      <RouterProvider router={router} />
    </MantineProvider>
  );
}

export default App;
