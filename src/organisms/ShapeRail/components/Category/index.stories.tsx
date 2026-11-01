import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TIERS } from '~/utils/shapes';
import { Category } from '.';

const meta = {
  component: Category,
  args: {
    category: TIERS[0].categories[0],
    active: 'cone',
    defaultOpen: true,
  },
} satisfies Meta<typeof Category>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Open: Story = {};

export const Closed: Story = { args: { defaultOpen: false } };
