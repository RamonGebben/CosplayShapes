import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MeasureHelp } from '.';

const meta = {
  component: MeasureHelp,
  decorators: [
    Story => (
      <div style={{ width: 300, minHeight: 420 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MeasureHelp>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
