import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Terms } from '.';

const meta = {
  component: Terms,
  args: {
    children: (
      <>
        <dt>Circumference</dt>
        <dd>All the way around, where a tape measure goes.</dd>
        <dt>Diameter</dt>
        <dd>Straight across, through the middle.</dd>
      </>
    ),
  },
} satisfies Meta<typeof Terms>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
