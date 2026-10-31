import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Actions } from '.';

const meta = {
  component: Actions,
  args: {
    children: 'Actions',
  },
} satisfies Meta<typeof Actions>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
