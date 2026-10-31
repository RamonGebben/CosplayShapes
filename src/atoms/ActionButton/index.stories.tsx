import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ActionButton } from '.';

const meta = {
  component: ActionButton,
  args: { children: 'SVG for cutter', $variant: 'secondary' },
} satisfies Meta<typeof ActionButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Primary: Story = {
  args: {
    $variant: 'primary',
    children: (
      <>
        Download PDF <span>· true scale</span>
      </>
    ),
  },
};
