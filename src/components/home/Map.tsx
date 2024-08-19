import { MapContainer } from 'react-leaflet';
import styles from './Map.module.scss';
import MapManager from './MapManager.tsx';
import { useFullScreenMap } from '../../hooks/useFullScreenMap.ts';

const Map = () => {
  const { toggleFullscreen } = useFullScreenMap();

  return (
    <div id="map-container">
      <MapContainer className={styles.map} center={[53, 0]} zoom={3} scrollWheelZoom={false}>
        <MapManager onToggleFullscreen={toggleFullscreen} />
      </MapContainer>
    </div>
  );
};

export default Map;
