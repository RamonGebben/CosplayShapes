import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { getMaterial } from '~/utils/materials';
import { buildPattern } from '~/utils/pattern';
import { ModelView } from '.';

const result = buildPattern('truncated-cone', {
  dims: { top: 260, bottom: 320, height: 180 },
  options: {},
  material: getMaterial('eva'),
  thicknessMm: 6,
  seamMm: 0,
});

if (!result.ok) throw new Error(result.message);

const meta = {
  component: ModelView,
  args: {
    model: result.pattern.model,
    highlight: 'seam',
    label: 'Truncated cone',
    onUnavailable: () => undefined,
  },
  decorators: [
    Story => (
      <div style={{ width: 320, height: 380, background: '#1d2bd6' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ModelView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
