import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Legend } from '.';

const meta = {
  component: Legend,
  args: {
    guides: true,
    pages: true,
    litLabel: 'Top circumference',
    unit: 'cm',
  },
} satisfies Meta<typeof Legend>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
