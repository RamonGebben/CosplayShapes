import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { buildExample } from '~/utils/examples';
import { ModelStill } from '.';

const meta = {
  component: ModelStill,
  args: {
    model: buildExample('truncated-cone').model,
    width: 160,
    height: 160,
  },
  decorators: [
    Story => (
      <div style={{ width: 160, height: 160, background: '#1d2bd6' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ModelStill>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Box: Story = { args: { model: buildExample('box').model } };
