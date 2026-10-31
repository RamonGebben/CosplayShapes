import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Example } from '.';

const meta = {
  component: Example,
  args: { children: 'Example: helmet crown' },
} satisfies Meta<typeof Example>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
