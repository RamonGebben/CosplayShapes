import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Brand } from '.';

const meta = {
  component: Brand,
  args: { href: '/', children: 'basic-shape' },
} satisfies Meta<typeof Brand>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
