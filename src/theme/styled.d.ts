import 'styled-components';
import type DesignSystem from '@pindakaasman/design-system';

declare module 'styled-components' {
  // Augments styled-components' theme type, so it has to be an interface.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends DesignSystem {}
}
