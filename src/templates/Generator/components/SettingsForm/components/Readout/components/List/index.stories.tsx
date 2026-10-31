import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { List } from '.';

const meta = {
  component: List,
  args: {
    children: (
      <div>
        <dt>Arc angle</dt>
        <dd>19.1°</dd>
      </div>
    ),
  },
} satisfies Meta<typeof List>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
