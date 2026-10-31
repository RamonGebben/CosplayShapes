import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Select } from '.';

const meta = {
  component: Select,
  args: {
    'aria-label': 'Material',
    children: (
      <>
        <option>EVA foam</option>
        <option>Fabric</option>
      </>
    ),
  },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
