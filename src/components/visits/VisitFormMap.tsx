import { Marker, TileLayer, useMapEvents } from 'react-leaflet';
import { TILE_LAYERS } from '../../lib/constants.ts';
import { markerIcons } from '../../lib/mapUtils.ts';
import { useEffect, useState } from 'react';
import { LatLng } from 'leaflet';

const VisitFormMap = ({
  onSetPosition,
  position,
}: {
  onSetPosition: (pos: LatLng) => void;
  position: LatLng | undefined;
}) => {
  const [clickPosition, setClickPosition] = useState<LatLng | undefined>();

  const map = useMapEvents({
    click: e => {
      setClickPosition(e.latlng);
      onSetPosition(e.latlng);
    },
  });

  useEffect(() => {
    if (position) {
      setClickPosition(position);
      map.setView(position);
    }
  }, [position]);

  return (
    <>
      <TileLayer attribution={TILE_LAYERS.default.attribution} url={TILE_LAYERS.default.url} />
      {clickPosition && <Marker position={clickPosition} icon={markerIcons.visit} />}
    </>
  );
};

export default VisitFormMap;
