import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Toggletip } from '.';

const meta = {
  component: Toggletip,
  args: {
    label: 'How to measure',
    children: 'Circumference goes all the way around.',
  },
  decorators: [
    Story => (
      <div style={{ width: 320, minHeight: 160 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Toggletip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OpensOnClickAndClosesOnEscape: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'How to measure' });
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText(/all the way around/)).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  },
};
