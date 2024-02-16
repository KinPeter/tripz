import { ActionIcon, Tooltip, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';

interface Props {
  closeMenu: () => void;
}

const ColorSchemeToggle = ({ closeMenu }: Props) => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  const toggleColorScheme = () => {
    closeMenu();
    setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light');
  };

  return (
    <Tooltip position="bottom" label="Toggle color scheme">
      <ActionIcon
        onClick={() => toggleColorScheme()}
        variant="default"
        size="lg"
        radius="xl"
        aria-label="Toggle color scheme"
      >
        {computedColorScheme === 'light' ? <IconMoon stroke={1} /> : <IconSun stroke={1} />}
      </ActionIcon>
    </Tooltip>
  );
};

export default ColorSchemeToggle;
