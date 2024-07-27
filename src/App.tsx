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
import Flights from './components/pages/Flights.tsx';
import Visits from './components/pages/Visits.tsx';
import FlightForm from './components/flights/FlightForm.tsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route index element={<Auth />} />
      <Route path="/user/:userId" element={<Home isPublic={true} />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/flights/new" element={<FlightForm isNew={true} />} />
        <Route path="/flights/edit/:flightId" element={<FlightForm isNew={false} />} />
        <Route path="/visits" element={<Visits />} />
      </Route>
    </Route>
  )
);

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme={'dark'}>
      <Notifications />
      <RouterProvider router={router} />
    </MantineProvider>
  );
}

export default App;
