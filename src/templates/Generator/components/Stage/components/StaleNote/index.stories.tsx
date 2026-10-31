import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { StaleNote } from '.';

const meta = {
  component: StaleNote,
  args: { children: 'Showing the last pattern that worked.' },
} satisfies Meta<typeof StaleNote>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
