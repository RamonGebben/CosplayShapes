import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Panel } from '.';

const meta = {
  component: Panel,
  args: { children: 'Circumference goes all the way around.' },
} satisfies Meta<typeof Panel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
