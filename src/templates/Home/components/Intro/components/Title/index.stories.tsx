import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Title } from '.';

const meta = {
  component: Title,
  args: {
    children: 'To get started, edit the page.tsx file.',
  },
} satisfies Meta<typeof Title>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
