import { Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import '@elfalem/leaflet-curve';
import L from 'leaflet';
import { calculateCurve } from '../../lib/calculateCurve.ts';

const MapManager = () => {
  const map = useMap();

  useEffect(() => {
    L.curve(calculateCurve([51.505, -0.09], [12.921, 9.02]), {
      color: 'rgba(255,255,255,0.5)',
      weight: 2,
    }).addTo(map);
  }, []);

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[51.505, -0.09]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </>
  );
};

export default MapManager;
