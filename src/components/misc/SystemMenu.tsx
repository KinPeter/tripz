import { ActionIcon, Tooltip } from '@mantine/core';
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
      <Tooltip position="bottom" label="System menu">
        <ActionIcon
          onClick={() => setOpen(!open)}
          variant={open ? 'light' : 'outline'}
          size="lg"
          radius="xl"
          aria-label="System menu"
        >
          {open ? <IconX /> : <IconDots />}
        </ActionIcon>
      </Tooltip>
      {open && (
        <div className={styles.content}>
          {isAuthenticated ? (
            <>
              <ColorSchemeToggle closeMenu={() => setOpen(false)} />

              <Tooltip position="bottom" label="Log out">
                <ActionIcon
                  onClick={() => logOut()}
                  variant="default"
                  size="lg"
                  radius="xl"
                  aria-label="Log out"
                >
                  <IconLogout className={styles.logoutIcon} size={20} />
                </ActionIcon>
              </Tooltip>
            </>
          ) : (
            <>
              <ColorSchemeToggle closeMenu={() => setOpen(false)} />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SystemMenu;
