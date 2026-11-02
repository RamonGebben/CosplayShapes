import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Credits } from '.';

const meta = {
  component: Credits,
  args: {
    $placement: 'intro',
    children: (
      <p>
        Made with ❤️ by <a href="#">@kernel.cosplay</a>
      </p>
    ),
  },
} satisfies Meta<typeof Credits>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Footer: Story = {
  args: { $placement: 'footer' },
  globals: { viewport: { value: 'mobile1' } },
};
