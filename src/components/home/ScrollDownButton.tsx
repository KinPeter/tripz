import styles from './Map.module.scss';
import { ActionIcon, Tooltip } from '@mantine/core';
import { IconChevronsDown } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

const ScrollDownButton = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY !== 0);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollDown = () => {
    window.scrollBy({ top: Math.floor((80 * window.innerHeight) / 100), behavior: 'smooth' });
  };

  return !isScrolled ? (
    <div className={styles.scrollDownButton}>
      <Tooltip position="bottom" label="Scroll down">
        <ActionIcon
          onClick={scrollDown}
          variant="outline"
          size="lg"
          radius="xl"
          aria-label="Scroll down"
        >
          <IconChevronsDown />
        </ActionIcon>
      </Tooltip>
    </div>
  ) : null;
};

export default ScrollDownButton;
