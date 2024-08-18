import { Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import '@elfalem/leaflet-curve';
import L from 'leaflet';
import { calculateCurve, markerIcons } from '../../lib/mapUtils.ts';
import { useComputedColorScheme } from '@mantine/core';
import { TILE_LAYERS, TileLayerKey } from '../../lib/constants.ts';
import MapMenu from './MapMenu.tsx';
import { useStore } from '../../store';
import { tomato } from '../../lib/mantine.ts';
import { MapMarker } from '../../types/map.ts';
import ScrollDownButton from './ScrollDownButton.tsx';
import YearFilter from './YearFilter.tsx';

const MapManager = ({ onToggleFullscreen }: { onToggleFullscreen: () => void }) => {
  const map = useMap();
  const colorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const [tileLayer, setTileLayer] = useState<TileLayerKey>(TileLayerKey.DEFAULT);
  const [tileLayerByColorScheme, setTileLayerByColorScheme] = useState<TileLayerKey>(
    colorScheme as TileLayerKey
  );
  const [flightMarkers, setFlightMarkers] = useState<MapMarker[]>([]);
  const [visitMarkers, setVisitMarkers] = useState<MapMarker[]>([]);
  const [flightsVisible, setFlightsVisible] = useState<boolean>(true);
  const [visitsVisible, setVisitsVisible] = useState<boolean>(true);
  const [curvesLayer, setCurvesLayer] = useState<L.LayerGroup | null>(null);
  const flights = useStore(s => s.mapFlightData);
  const visits = useStore(s => s.mapVisitsData);

  useEffect(() => {
    setTileLayerByColorScheme(colorScheme as TileLayerKey);
    setTileLayer(colorScheme as TileLayerKey);
  }, [colorScheme]);

  useEffect(() => {
    if (!visits) return;
    setVisitMarkers(visits.markers);
  }, [visits, map]);

  useEffect(() => {
    if (!flights) return;
    if (curvesLayer) {
      map.removeLayer(curvesLayer);
    }
    const curves = flights.routes.map(({ a, b, count }) => {
      const color =
        count > 9 ? tomato[9] : count > 5 ? tomato[7] : count > 2 ? tomato[4] : tomato[2];
      return L.curve(calculateCurve(a, b), {
        color,
        weight: 2,
      });
    });
    const newCurvesLayer = L.layerGroup(curves);
    map.addLayer(newCurvesLayer);
    setCurvesLayer(newCurvesLayer);
    setFlightMarkers(flights.markers);

    const width = window.innerWidth;
    let zoomLevel;
    switch (true) {
      case width <= 600:
        zoomLevel = 2;
        break;
      case width <= 1100:
        zoomLevel = 3;
        break;
      case width <= 2800:
        zoomLevel = 4;
        break;
      default:
        zoomLevel = 5;
    }

    map.setView(flights.center, zoomLevel);
  }, [flights, map]);

  const toggleDefaultTileLayer = () => {
    setTileLayer(
      tileLayer === TileLayerKey.DEFAULT ? tileLayerByColorScheme : TileLayerKey.DEFAULT
    );
  };

  const toggleVisits = () => {
    setVisitsVisible(!visitsVisible);
  };

  const toggleFlights = () => {
    const isVisible = !flightsVisible;
    setFlightsVisible(isVisible);
    if (!curvesLayer) return;
    if (isVisible) {
      map.addLayer(curvesLayer);
    } else {
      map.removeLayer(curvesLayer);
    }
  };

  const toggleZoom = () => {
    if (map.scrollWheelZoom.enabled()) {
      map.scrollWheelZoom.disable();
    } else {
      map.scrollWheelZoom.enable();
    }
  };

  return (
    <>
      <TileLayer
        attribution={TILE_LAYERS[tileLayer].attribution}
        url={TILE_LAYERS[tileLayer].url}
      />
      {visitsVisible &&
        visitMarkers.map(({ pos, popup }) => (
          <Marker position={pos} icon={markerIcons.visit} key={`${pos[0]}-${pos[1]}`}>
            <Popup closeButton={false}>{popup}</Popup>
          </Marker>
        ))}
      {flightsVisible &&
        flightMarkers.map(({ pos, popup }) => (
          <Marker position={pos} icon={markerIcons.flight} key={`${pos[0]}-${pos[1]}`}>
            <Popup closeButton={false}>{popup}</Popup>
          </Marker>
        ))}
      <MapMenu
        onToggleDefaultLayer={toggleDefaultTileLayer}
        onToggleFlights={toggleFlights}
        onToggleVisits={toggleVisits}
        onToggleZoom={toggleZoom}
        onToggleFullscreen={onToggleFullscreen}
      />
      <YearFilter />
      <ScrollDownButton />
    </>
  );
};

export default MapManager;
