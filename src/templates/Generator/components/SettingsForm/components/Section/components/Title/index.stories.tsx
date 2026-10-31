import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Title } from '.';

const meta = {
  component: Title,
  args: { children: 'Size' },
} satisfies Meta<typeof Title>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
