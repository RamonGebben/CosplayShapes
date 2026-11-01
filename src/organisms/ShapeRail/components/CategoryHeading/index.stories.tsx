import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CategoryToggle } from '../CategoryToggle';
import { CategoryHeading } from '.';

const meta = {
  component: CategoryHeading,
  args: {
    children: (
      <CategoryToggle type="button" aria-expanded>
        Tubes and cones
      </CategoryToggle>
    ),
  },
} satisfies Meta<typeof CategoryHeading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
