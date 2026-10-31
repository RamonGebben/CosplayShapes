import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Input } from '.';

const meta = {
  component: Input,
  args: { defaultValue: '26.0', 'aria-label': 'Top circumference' },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Invalid: Story = {
  args: { defaultValue: '', 'aria-invalid': true },
};
