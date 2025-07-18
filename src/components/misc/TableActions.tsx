import { ActionIcon, Popover, Tooltip } from '@mantine/core';
import { IconCheck, IconEdit, IconTrash, IconX } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { Flight, Visit } from '../../types';
import { useCallback, useEffect, useState } from 'react';
import { useFlightsApi } from '../../hooks/useFlightsApi.ts';
import { useVisitsApi } from '../../hooks/useVisitsApi.ts';
import { useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import styles from './TableActions.module.scss';

interface Props {
  item: Flight | Visit;
  dataType: 'visits' | 'flights';
}

const TableActions = ({ item, dataType }: Props) => {
  const navigate = useNavigate();
  const { deleteFlight } = useFlightsApi();
  const { deleteVisit } = useVisitsApi();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const {
    mutate: startDeleteVisit,
    data: deleteVisitData,
    error: deleteVisitError,
    isPending: deleteVisitLoading,
  } = useMutation({
    mutationFn: () => deleteVisit(item.id),
  });

  const {
    mutate: startDeleteFlight,
    data: deleteFlightData,
    error: deleteFlightError,
    isPending: deleteFlightLoading,
  } = useMutation({
    mutationFn: () => deleteFlight(item.id),
  });

  useEffect(() => {
    if (deleteVisitData) {
      navigate('/home');
      notifications.show({
        title: 'Great!',
        message: 'Your visit has been deleted.',
        color: 'green',
      });
    } else if (deleteVisitError) {
      notifications.show({
        title: 'Oops!',
        message: deleteVisitError.message,
        color: 'red',
      });
    }
  }, [deleteVisitData, deleteVisitError, navigate]);

  useEffect(() => {
    if (deleteFlightData) {
      navigate('/home');
      notifications.show({
        title: 'Great!',
        message: 'Your flight has been deleted.',
        color: 'green',
      });
    } else if (deleteFlightError) {
      notifications.show({
        title: 'Oops!',
        message: deleteFlightError.message,
        color: 'red',
      });
    }
  }, [deleteFlightData, deleteFlightError, navigate]);

  const navigateToEdit = useCallback(() => {
    navigate(`/${dataType}/edit/${item.id}`);
  }, [dataType, item]);

  const processDelete = useCallback(() => {
    switch (dataType) {
      case 'visits':
        startDeleteVisit();
        break;
      case 'flights':
        startDeleteFlight();
        break;
    }
  }, [dataType, item]);

  const confirmationContent = (
    <div className={styles.confirmationContent}>
      <h1>Are you sure?</h1>
      <div>
        <ActionIcon
          variant="filled"
          color="gray"
          mr="md"
          onClick={() => setConfirmOpen(false)}
          disabled={deleteVisitLoading || deleteFlightLoading}
        >
          <IconX></IconX>
        </ActionIcon>
        <ActionIcon
          variant="filled"
          color="red"
          mr="md"
          onClick={processDelete}
          disabled={deleteVisitLoading || deleteFlightLoading}
          loading={deleteVisitLoading || deleteFlightLoading}
        >
          <IconCheck></IconCheck>
        </ActionIcon>
      </div>
    </div>
  );

  return (
    <>
      <Tooltip label="Edit">
        <ActionIcon
          variant="transparent"
          mr="md"
          onClick={navigateToEdit}
          disabled={deleteVisitLoading || deleteFlightLoading}
        >
          <IconEdit></IconEdit>
        </ActionIcon>
      </Tooltip>
      <Popover
        trapFocus
        withArrow
        position="top"
        offset={0}
        opened={confirmOpen}
        onChange={setConfirmOpen}
      >
        <Tooltip label="Delete">
          <Popover.Target>
            <ActionIcon
              variant="transparent"
              disabled={deleteVisitLoading || deleteFlightLoading}
              onClick={() => setConfirmOpen(o => !o)}
            >
              <IconTrash></IconTrash>
            </ActionIcon>
          </Popover.Target>
        </Tooltip>
        <Popover.Dropdown>{confirmationContent}</Popover.Dropdown>
      </Popover>
    </>
  );
};

export default TableActions;
