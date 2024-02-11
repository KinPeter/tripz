import { MapContainer } from 'react-leaflet';
import styles from './Map.module.scss';
import MapManager from './MapManager.tsx';

const Map = () => {
  return (
    <MapContainer className={styles.map} center={[53, 0]} zoom={3} scrollWheelZoom={true}>
      <MapManager />
    </MapContainer>
  );
};

export default Map;
