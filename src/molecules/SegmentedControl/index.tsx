import { SegmentButton } from '~/atoms/SegmentButton';
import { Group } from './components/Group';

export interface SegmentedControlProps<T extends string> {
  label: string;
  options: Array<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
}

export const SegmentedControl = <T extends string>({
  label,
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) => (
  <Group role="group" aria-label={label} $count={options.length}>
    {options.map(option => (
      <SegmentButton
        key={option.value}
        aria-pressed={option.value === value}
        onClick={() => onChange(option.value)}
      >
        {option.label}
      </SegmentButton>
    ))}
  </Group>
);
