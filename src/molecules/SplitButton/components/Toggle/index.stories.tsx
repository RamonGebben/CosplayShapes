import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Toggle } from '.';

const meta = {
  component: Toggle,
  args: {
    $variant: 'primary',
    'aria-label': 'More export options',
    children: 'More',
  },
} satisfies Meta<typeof Toggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
