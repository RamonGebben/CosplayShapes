import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { PaperSelect } from '.';

const meta = {
  component: PaperSelect,
  args: { value: 'a4', onChange: fn() },
} satisfies Meta<typeof PaperSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const PicksALargerSheet: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.selectOptions(
      canvas.getByRole('combobox', { name: 'Paper size' }),
      'a3',
    );
    await expect(args.onChange).toHaveBeenCalledWith('a3');
  },
};
