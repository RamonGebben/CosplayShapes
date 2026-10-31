import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { VisuallyHidden } from '.';

const meta = {
  component: VisuallyHidden,
  args: { children: 'Only screen readers announce this.' },
} satisfies Meta<typeof VisuallyHidden>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
