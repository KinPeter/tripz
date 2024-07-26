import styles from './PageHeader.module.scss';
import { PropsWithChildren } from 'react';
import { ActionIcon } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { IconChevronLeft } from '@tabler/icons-react';

const PageHeader = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  return (
    <header className={styles.pageHeader}>
      <ActionIcon onClick={() => navigate(-1)} variant="transparent" size="xl" aria-label="Back">
        <IconChevronLeft></IconChevronLeft>
      </ActionIcon>
      <h1>{children}</h1>
    </header>
  );
};

export default PageHeader;
