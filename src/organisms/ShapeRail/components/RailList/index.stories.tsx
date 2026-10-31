import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { RailList } from '.';

const meta = {
  component: RailList,
  args: { children: <li>Cone</li> },
} satisfies Meta<typeof RailList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
