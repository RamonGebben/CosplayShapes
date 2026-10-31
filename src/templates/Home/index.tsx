import { Button } from '~/atoms/Button';
import { Logo } from '~/atoms/Logo';
import { Actions } from './components/Actions';
import { Intro } from './components/Intro';
import { Main } from './components/Main';
import { Page } from './components/Page';

export const Home = () => {
  return (
    <Page>
      <Main>
        <Logo
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          preload
        />
        <Intro />
        <Actions>
          <Button
            $variant="primary"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Logo
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={14}
            />
            Deploy Now
          </Button>
          <Button
            $variant="secondary"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </Button>
        </Actions>
      </Main>
    </Page>
  );
};
