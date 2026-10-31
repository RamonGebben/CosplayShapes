import { Code } from '~/atoms/Code';
import { InlineLink } from '~/atoms/InlineLink';
import { Lead } from './components/Lead';
import { Stack } from './components/Stack';
import { Title } from './components/Title';

export const Intro = () => {
  return (
    <Stack>
      <Title>
        To get started, edit the <Code>page.tsx</Code> file.
      </Title>
      <Lead>
        Looking for a starting point or more instructions? Head over to{' '}
        <InlineLink
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Templates
        </InlineLink>{' '}
        or the{' '}
        <InlineLink
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learning
        </InlineLink>{' '}
        center.
      </Lead>
    </Stack>
  );
};
