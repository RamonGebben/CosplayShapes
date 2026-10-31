import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Summary } from '.';

const meta = {
  component: Summary,
  args: { children: 'Seam 18.0 cm · arc 19.1°' },
} satisfies Meta<typeof Summary>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
