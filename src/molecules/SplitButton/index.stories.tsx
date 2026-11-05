import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { SplitButton } from '.';

const meta = {
  component: SplitButton,
  args: {
    children: 'Download PDF',
    onClick: fn(),
    menuLabel: 'More export options',
    items: [
      {
        label: 'SVG for cutter',
        hint: 'Cricut, laser or vinyl cutter',
        onSelect: fn(),
      },
      {
        label: 'Copy link',
        hint: 'Opens this pattern with your measurements',
        onSelect: fn(),
      },
    ],
  },
  decorators: [
    Story => (
      <div
        style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 160 }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SplitButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };

export const ChoosesWithTheKeyboard: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: 'More export options' });
    toggle.focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(
      canvas.getByRole('menuitem', { name: /SVG for cutter/ }),
    ).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(args.items[1].onSelect).toHaveBeenCalled();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toHaveFocus();
  },
};

export const ClosesOnEscape: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: 'More export options' });
    await userEvent.click(toggle);
    await expect(canvas.getByRole('menu')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(args.items[0].onSelect).not.toHaveBeenCalled();
  },
};

export const SkipsADisabledChoice: Story = {
  args: {
    items: [
      { label: 'SVG for cutter', onSelect: fn(), disabled: true },
      { label: 'Copy link', onSelect: fn() },
    ],
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'More export options' }),
    );
    await userEvent.click(
      canvas.getByRole('menuitem', { name: 'SVG for cutter' }),
    );
    await expect(args.items[0].onSelect).not.toHaveBeenCalled();
    await expect(canvas.getByRole('menu')).toBeVisible();
  },
};
