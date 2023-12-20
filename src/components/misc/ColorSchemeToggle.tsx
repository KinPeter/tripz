import { ActionIcon, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';

const ColorSchemeToggle = () => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  return (
    <ActionIcon
      onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
      variant="default"
      size="lg"
      radius="xl"
      aria-label="Toggle color scheme"
    >
      {computedColorScheme === 'light' ? <IconMoon stroke={1} /> : <IconSun stroke={1} />}
    </ActionIcon>
  );
};

export default ColorSchemeToggle;
