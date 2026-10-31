import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { List } from '.';

const meta = {
  component: List,
  args: { children: <li>Cut line</li> },
} satisfies Meta<typeof List>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
