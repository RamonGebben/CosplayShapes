import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Input } from '~/atoms/Input';
import { FieldRow } from '.';

const meta = {
  component: FieldRow,
  args: {
    id: 'height',
    label: 'Height',
    unit: 'cm',
    unitName: 'centimetres',
    children: <Input id="height" defaultValue="18.0" />,
  },
} satisfies Meta<typeof FieldRow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: {
    error: 'Enter a length greater than 0.',
    children: <Input id="height" defaultValue="0" aria-invalid />,
  },
};
