import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Intro } from '.';

const meta = {
  component: Intro,
} satisfies Meta<typeof Intro>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
