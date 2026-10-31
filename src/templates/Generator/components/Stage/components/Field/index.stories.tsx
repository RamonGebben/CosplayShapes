import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Field } from '.';

const meta = {
  component: Field,
  args: {},
  decorators: [
    Story => (
      <div style={{ position: 'relative', height: 420 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Field>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
