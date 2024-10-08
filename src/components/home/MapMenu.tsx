import { useState } from 'react';
import styles from './Map.module.scss';
import { ActionIcon, Tooltip } from '@mantine/core';
import {
  IconLayersSubtract,
  IconMapCog,
  IconX,
  IconPlaneTilt,
  IconMapPin,
  IconZoomPan,
  IconMaximize,
} from '@tabler/icons-react';

interface Props {
  onToggleDefaultLayer: () => void;
  onToggleFlights: () => void;
  onToggleVisits: () => void;
  onToggleZoom: () => void;
  onToggleFullscreen: () => void;
}

const MapMenu = ({
  onToggleDefaultLayer,
  onToggleFlights,
  onToggleVisits,
  onToggleZoom,
  onToggleFullscreen,
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleToggleDefaultLayer = () => {
    setOpen(false);
    onToggleDefaultLayer();
  };

  const handleToggleFlights = () => {
    setOpen(false);
    onToggleFlights();
  };

  const handleToggleVisits = () => {
    setOpen(false);
    onToggleVisits();
  };

  const handleToggleZoom = () => {
    setOpen(false);
    onToggleZoom();
  };

  const handleToggleFullscreen = () => {
    setOpen(false);
    onToggleFullscreen();
  };

  return (
    <div className={styles.mapMenu}>
      <Tooltip position="bottom" label="Map menu">
        <ActionIcon
          onClick={() => setOpen(!open)}
          variant={open ? 'light' : 'outline'}
          size="lg"
          radius="xl"
          aria-label="Map menu"
        >
          {open ? <IconX /> : <IconMapCog />}
        </ActionIcon>
      </Tooltip>
      {open && (
        <div className={styles.content}>
          <Tooltip position="bottom" label="Toggle fullscreen">
            <ActionIcon
              onClick={() => handleToggleFullscreen()}
              variant="default"
              size="lg"
              radius="xl"
              aria-label="Toggle fullscreen"
            >
              <IconMaximize />
            </ActionIcon>
          </Tooltip>
          <Tooltip position="bottom" label="Toggle mouse zoom">
            <ActionIcon
              onClick={() => handleToggleZoom()}
              variant="default"
              size="lg"
              radius="xl"
              aria-label="Toggle mouse zoom"
            >
              <IconZoomPan />
            </ActionIcon>
          </Tooltip>
          <Tooltip position="bottom" label="Toggle default map layer">
            <ActionIcon
              onClick={() => handleToggleDefaultLayer()}
              variant="default"
              size="lg"
              radius="xl"
              aria-label="Toggle default map layer"
            >
              <IconLayersSubtract />
            </ActionIcon>
          </Tooltip>
          <Tooltip position="bottom" label="Toggle flights">
            <ActionIcon
              onClick={() => handleToggleFlights()}
              variant="default"
              size="lg"
              radius="xl"
              aria-label="Toggle flights"
            >
              <IconPlaneTilt />
            </ActionIcon>
          </Tooltip>
          <Tooltip position="bottom" label="Toggle visits">
            <ActionIcon
              onClick={() => handleToggleVisits()}
              variant="default"
              size="lg"
              radius="xl"
              aria-label="Toggle visits"
            >
              <IconMapPin />
            </ActionIcon>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default MapMenu;
