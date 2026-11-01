import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Toggle } from '.';

const meta = {
  component: Toggle,
  args: {
    'aria-expanded': false,
    children: (
      <span>
        <strong>Angled and bent tubes</strong>
        <span>Angled cylinder, Elbow, Curved horn</span>
      </span>
    ),
  },
} satisfies Meta<typeof Toggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
