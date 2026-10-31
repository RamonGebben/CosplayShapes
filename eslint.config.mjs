import { defineConfig, globalIgnores } from 'eslint/config';
import next from '@pindakaasman/eslint-config/next';
import storybook from '@pindakaasman/eslint-config/storybook';

export default defineConfig([
  // Vendored skills and generated design working files.
  globalIgnores(['.claude/**', '.opencode/**', '.impeccable/**']),
  ...next,
  ...storybook,
]);
