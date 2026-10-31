import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Page } from '.';

const meta = {
  component: Page,
  args: {
    children: 'Page content',
  },
} satisfies Meta<typeof Page>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
