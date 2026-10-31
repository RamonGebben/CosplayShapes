import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TileGrid } from '.';

const meta = {
  component: TileGrid,
  args: { children: <li>Cone</li> },
} satisfies Meta<typeof TileGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
