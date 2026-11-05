import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Status } from '.';

const meta = {
  component: Status,
  args: { $error: false, children: 'PDF saved.' },
} satisfies Meta<typeof Status>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Error: Story = {
  args: { $error: true, children: 'The PDF could not be made.' },
};
