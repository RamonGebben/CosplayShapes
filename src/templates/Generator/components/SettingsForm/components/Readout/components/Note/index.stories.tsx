import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Note } from '.';

const meta = {
  component: Note,
  args: { children: 'Score the dashed lines, fold, and glue the tabs inside.' },
} satisfies Meta<typeof Note>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
