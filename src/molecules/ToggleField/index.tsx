import { Checkbox } from '~/atoms/Checkbox';
import { Hint } from './components/Hint';
import { Text } from './components/Text';
import { Wrapper } from './components/Wrapper';

export interface ToggleFieldProps {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const ToggleField = ({
  label,
  hint,
  checked,
  onChange,
}: ToggleFieldProps) => (
  <Wrapper>
    <Checkbox
      checked={checked}
      onChange={event => onChange(event.target.checked)}
    />
    <Text>
      <strong>{label}</strong>
      {hint && <Hint>{hint}</Hint>}
    </Text>
  </Wrapper>
);
