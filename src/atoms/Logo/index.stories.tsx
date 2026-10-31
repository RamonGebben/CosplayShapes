import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Logo } from '.';

const meta = {
  component: Logo,
  args: {
    src: '/next.svg',
    alt: 'Next.js logo',
    width: 100,
    height: 20,
  },
} satisfies Meta<typeof Logo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
