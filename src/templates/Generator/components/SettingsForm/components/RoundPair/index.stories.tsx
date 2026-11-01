import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { generatorReducer, initialState } from '~/utils/generatorState';
import { RoundPair } from '.';

const state = initialState('cylinder');

const meta = {
  component: RoundPair,
  args: {
    field: {
      kind: 'length',
      key: 'circumference',
      label: 'Circumference',
      diameterLabel: 'Diameter',
      example: 280,
      edge: 'circumference',
    },
    state,
    errors: {},
    dispatch: fn(),
    unitName: 'centimetres',
    onFocus: fn(),
  },
  decorators: [
    Story => (
      <div style={{ width: 300 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RoundPair>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TypingADiameter: Story = {
  play: async ({ args, canvasElement }) => {
    const input = within(canvasElement).getByLabelText(/^Diameter/);
    await userEvent.type(input, '1');
    await expect(args.dispatch).toHaveBeenCalledWith({
      type: 'diameter',
      key: 'circumference',
      value: '8.911',
    });
  },
};

export const ErrorOnTheDiameter: Story = {
  args: {
    state: generatorReducer(state, {
      type: 'diameter',
      key: 'circumference',
      value: '',
    }),
    errors: { circumference: 'Enter a number.' },
  },
};
