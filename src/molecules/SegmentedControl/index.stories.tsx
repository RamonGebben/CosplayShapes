import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SegmentedControl } from '.';

const meta = {
  component: SegmentedControl,
  args: {
    label: 'Units',
    options: [
      { value: 'cm', label: 'Metric (cm)' },
      { value: 'in', label: 'Imperial (in)' },
    ],
    value: 'cm',
    onChange: () => undefined,
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
