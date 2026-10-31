import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Readout } from '.';

const meta = {
  component: Readout,
  args: {
    facts: [
      { label: 'Seam length', lengths: [180.3] },
      { label: 'Arc angle', degrees: 19.1 },
    ],
    unit: 'cm',
    notes: ['Cut edges butt together and are glued with contact cement.'],
  },
} satisfies Meta<typeof Readout>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
