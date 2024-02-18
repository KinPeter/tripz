import { ActionIcon, Tooltip } from '@mantine/core';
import { useStore } from '../../store';
import ColorSchemeToggle from './ColorSchemeToggle.tsx';
import { useState } from 'react';
import styles from './SystemMenu.module.scss';
import { IconDots, IconLogin, IconLogout, IconX } from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';

const SystemMenu = () => {
  const isAuthenticated = useStore(s => s.isAuthenticated);
  const logOut = useStore(s => s.handleLogout);
  const [open, setOpen] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();

  const navigateToAuth = () => {
    navigate('/');
    setOpen(false);
  };

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

              {location.pathname !== '/' ? (
                <Tooltip position="bottom" label="Log in">
                  <ActionIcon
                    onClick={navigateToAuth}
                    variant="default"
                    size="lg"
                    radius="xl"
                    aria-label="Log in"
                  >
                    <IconLogin className={styles.logoutIcon} size={20} />
                  </ActionIcon>
                </Tooltip>
              ) : null}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SystemMenu;
