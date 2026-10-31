import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ShapeRail } from '.';

const meta = {
  component: ShapeRail,
  args: { active: 'truncated-cone' },
} satisfies Meta<typeof ShapeRail>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
