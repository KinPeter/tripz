import { ActionIcon } from '@mantine/core';
import { useStore } from '../../store';
import ColorSchemeToggle from './ColorSchemeToggle.tsx';
import { useState } from 'react';
import styles from './SystemMenu.module.scss';
import { IconDots, IconLogout, IconX } from '@tabler/icons-react';

const SystemMenu = () => {
  const isAuthenticated = useStore(s => s.isAuthenticated);
  const logOut = useStore(s => s.handleLogout);
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className={styles.systemMenu}>
      <ActionIcon
        onClick={() => setOpen(!open)}
        variant={open ? 'light' : 'outline'}
        size="lg"
        radius="xl"
        aria-label="System menu"
      >
        {open ? <IconX /> : <IconDots />}
      </ActionIcon>
      {open && (
        <div className={styles.content}>
          {isAuthenticated ? (
            <>
              <ColorSchemeToggle />
              <ActionIcon
                onClick={() => logOut()}
                variant="default"
                size="lg"
                radius="xl"
                aria-label="Log out"
              >
                <IconLogout className={styles.logoutIcon} size={20} />
              </ActionIcon>
            </>
          ) : (
            <>
              <ColorSchemeToggle />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SystemMenu;
