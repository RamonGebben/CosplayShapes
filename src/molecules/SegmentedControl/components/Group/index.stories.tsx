import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Group } from '.';

const meta = {
  component: Group,
  args: {
    $count: 2,
    children: (
      <>
        <button>cm</button>
        <button>in</button>
      </>
    ),
  },
} satisfies Meta<typeof Group>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
