import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ToggleField } from '.';

const meta = {
  component: ToggleField,
  args: {
    label: 'Compensate for thickness',
    hint: 'Measure the body or form it wraps around.',
    checked: true,
    onChange: () => undefined,
  },
} satisfies Meta<typeof ToggleField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
