import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MeasureDiagram } from '.';

const meta = {
  component: MeasureDiagram,
  args: { titleId: 'measure-diagram-title' },
  decorators: [
    Story => (
      <div style={{ width: 300, background: '#ffffff', padding: 16 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MeasureDiagram>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
