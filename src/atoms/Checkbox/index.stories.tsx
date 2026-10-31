import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Checkbox } from '.';

const meta = {
  component: Checkbox,
  args: { defaultChecked: true, 'aria-label': 'Compensate for thickness' },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
