import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Row } from '.';

const meta = {
  component: Row,
  args: {
    $wide: false,
    $joined: false,
    children: (
      <>
        <span>Height</span>
        <span>18.0</span>
        <span>cm</span>
      </>
    ),
  },
} satisfies Meta<typeof Row>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
