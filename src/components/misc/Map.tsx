import { MapContainer } from 'react-leaflet';
import styles from './Map.module.scss';
import MapManager from './MapManager.tsx';

const Map = () => {
  return (
    <MapContainer className={styles.map} center={[51.505, -0.09]} zoom={3} scrollWheelZoom={false}>
      <MapManager />
    </MapContainer>
  );
};

export default Map;
