import { ActionIcon, Code, Popover, Table } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { theme } from '../../lib/mantine.ts';
import { IconInfoCircle } from '@tabler/icons-react';

const rows = [
  ['*from ICN', 'flights from'],
  ['*to Chania', 'flights to'],
  ['*airline 5P', 'airline'],
  ['*aircraft boeing', 'airline'],
  ['*seat aisle', 'seat type'],
  ['*class Y', 'flight class'],
  ['*reason leisure', 'flight reason'],
];

const FlightSearchHelp = () => {
  const [opened, { close, open }] = useDisclosure(false);

  return (
    <Popover width={400} position="bottom" withArrow shadow="md" opened={opened}>
      <Popover.Target>
        <ActionIcon
          variant="subtle"
          size="md"
          color={theme.colors!.tomato![4]}
          onClick={open}
          onMouseEnter={open}
          onMouseLeave={close}
          onBlur={close}
        >
          <IconInfoCircle size={24}></IconInfoCircle>
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown style={{ pointerEvents: 'none' }}>
        <p>Search by airport or year, or try the following filters:</p>
        <Table>
          <Table.Tbody>
            {rows.map(([code, info], index) => (
              <Table.Tr key={index}>
                <Table.Td>
                  <Code>{code}</Code>
                </Table.Td>
                <Table.Td>{info}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Popover.Dropdown>
    </Popover>
  );
};

export default FlightSearchHelp;
