import { defineConfig } from 'eslint/config';
import next from '@pindakaasman/eslint-config/next';
import storybook from '@pindakaasman/eslint-config/storybook';

export default defineConfig([...next, ...storybook]);
