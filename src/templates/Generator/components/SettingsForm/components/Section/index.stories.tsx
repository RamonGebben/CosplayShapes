import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Section } from '.';

const meta = {
  component: Section,
  args: { title: 'Size', aside: 'Example: bracer', children: <p>Fields</p> },
} satisfies Meta<typeof Section>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
