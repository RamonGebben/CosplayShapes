import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Art } from '.';

const meta = {
  component: Art,
  args: { children: 'Art' },
} satisfies Meta<typeof Art>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
