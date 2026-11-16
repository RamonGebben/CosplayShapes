import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Intro } from '.';

const meta = {
  component: Intro,
  args: {
    children:
      'A cone unrolls into one fan-shaped piece with a single seam. Use it for horns, spikes, claws and hat tips.',
  },
} satisfies Meta<typeof Intro>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
