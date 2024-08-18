import { MapContainer } from 'react-leaflet';
import styles from './Map.module.scss';
import MapManager from './MapManager.tsx';
import { useLayoutEffect } from 'react';

const Map = () => {
  const toggleFullscreen = () => {
    const map = document.getElementById('map-container');
    if (!map) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().then();
    } else {
      map.requestFullscreen().then();
    }
  };

  useLayoutEffect(() => {
    const mapContainer = document.getElementById('map-container');
    if (!mapContainer) return;
    const listener = () => {
      const map = mapContainer.querySelector(':scope > div') as HTMLDivElement;
      if (!map) return;
      map.style.height = document.fullscreenElement ? '100vh' : '80vh';
    };
    mapContainer.addEventListener('fullscreenchange', listener);

    return () => {
      mapContainer.removeEventListener('fullscreenchange', listener);
    };
  }, []);

  return (
    <div id="map-container">
      <MapContainer className={styles.map} center={[53, 0]} zoom={3} scrollWheelZoom={false}>
        <MapManager onToggleFullscreen={toggleFullscreen} />
      </MapContainer>
    </div>
  );
};

export default Map;
