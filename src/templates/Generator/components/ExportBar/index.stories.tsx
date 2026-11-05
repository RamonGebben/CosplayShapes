import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ExportBar } from '.';

const meta = {
  component: ExportBar,
  args: {
    pieces: '1 piece',
    pages: '2 A4 pages',
    paper: 'a4',
    onPaper: () => undefined,
    onPdf: () => undefined,
    onSvg: () => undefined,
    onShare: () => undefined,
    status: 'idle',
    making: false,
    disabled: false,
  },
} satisfies Meta<typeof ExportBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Working: Story = { args: { making: true } };

export const Failed: Story = { args: { status: 'failed' } };

export const Copied: Story = { args: { status: 'copied' } };
