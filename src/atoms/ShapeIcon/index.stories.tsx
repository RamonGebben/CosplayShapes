import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ShapeIcon } from '.';

const meta = {
  component: ShapeIcon,
  args: { slug: 'truncated-cone', size: 64 },
} satisfies Meta<typeof ShapeIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
