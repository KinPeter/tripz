import { useState } from 'react';
import styles from './Map.module.scss';
import { ActionIcon } from '@mantine/core';
import { IconLayersSubtract, IconMapCog, IconX } from '@tabler/icons-react';

interface Props {
  onToggleDefaultLayer: () => void;
}

const MapMenu = ({ onToggleDefaultLayer }: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className={styles.mapMenu}>
      <ActionIcon
        onClick={() => setOpen(!open)}
        variant={open ? 'light' : 'outline'}
        size="lg"
        radius="xl"
        aria-label="Map menu"
      >
        {open ? <IconX /> : <IconMapCog />}
      </ActionIcon>
      {open && (
        <div className={styles.content}>
          <ActionIcon
            onClick={() => onToggleDefaultLayer()}
            variant="default"
            size="lg"
            radius="xl"
            aria-label="Toggle default map layer"
          >
            <IconLayersSubtract />
          </ActionIcon>
        </div>
      )}
    </div>
  );
};

export default MapMenu;
