import styles from './FlightForm.module.scss';
import PageHeader from '../misc/PageHeader.tsx';
import { useForm } from '@mantine/form';
import {
  Flight as FlightWithId,
  FlightClass,
  FlightReason,
  flightSchema,
  SeatType,
} from '@kinpeter/pk-common';
import { yupResolver } from 'mantine-form-yup-resolver';

type Flight = Omit<FlightWithId, 'id' | 'createdAt'>;

const flightInitialValues = {
  date: '0000-00-00',
  flightNumber: '',
  departureTime: '00:00:00',
  arrivalTime: '00:00:00',
  duration: '00:00:00',
  registration: '',
  seatNumber: '',
  seatType: SeatType.AISLE,
  flightClass: FlightClass.ECONOMY,
  flightReason: FlightReason.LEISURE,
  distance: 0,
  note: '',
  from: {
    iata: '',
    icao: '',
    country: '',
    city: '',
    name: '',
    lat: 0,
    lng: 0,
  },
  to: {
    iata: '',
    icao: '',
    country: '',
    city: '',
    name: '',
    lat: 0,
    lng: 0,
  },
  airline: {
    iata: '',
    icao: '',
    name: '',
  },
  aircraft: {
    icao: '',
    name: '',
  },
};

const FlightForm = ({ isNew }: { isNew: boolean }) => {
  const form = useForm<Flight>({
    initialValues: flightInitialValues,
    validate: yupResolver(flightSchema),
  });

  return (
    <div className={styles.container}>
      <PageHeader>{isNew ? 'New Flight' : 'Edit flight'}</PageHeader>
      <div className={styles.form}>
        <form
          onSubmit={form.onSubmit(values => {
            console.log(values);
          })}
        ></form>
      </div>
    </div>
  );
};

export default FlightForm;
