import { Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import '@elfalem/leaflet-curve';
import L from 'leaflet';
import { calculateCurve } from '../../lib/calculateCurve.ts';
import { useComputedColorScheme } from '@mantine/core';
import { TILE_LAYERS, TileLayerKey } from '../../lib/constants.ts';
import MapMenu from './MapMenu.tsx';
import { useStore } from '../../store';

const MapManager = () => {
  const map = useMap();
  const colorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const [tileLayer, setTileLayer] = useState<TileLayerKey>(TileLayerKey.DEFAULT);
  const [tileLayerByColorScheme, setTileLayerByColorScheme] = useState<TileLayerKey>(
    colorScheme as TileLayerKey
  );
  const flights = useStore(s => s.flights);

  useEffect(() => {
    setTileLayerByColorScheme(colorScheme as TileLayerKey);
    setTileLayer(colorScheme as TileLayerKey);
  }, [colorScheme]);

  useEffect(() => {
    L.curve(calculateCurve([51.505, -0.09], [12.921, 9.02]), {
      color: 'rgba(255,255,255,0.5)',
      weight: 2,
    }).addTo(map);
  }, [map]);

  useEffect(() => {
    // TODO
  }, [flights]);

  const toggleDefaultTileLayer = () => {
    setTileLayer(
      tileLayer === TileLayerKey.DEFAULT ? tileLayerByColorScheme : TileLayerKey.DEFAULT
    );
  };

  return (
    <>
      <TileLayer
        attribution={TILE_LAYERS[tileLayer].attribution}
        url={TILE_LAYERS[tileLayer].url}
      />
      <Marker position={[51.505, -0.09]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
      <MapMenu onToggleDefaultLayer={toggleDefaultTileLayer} />
    </>
  );
};

export default MapManager;
