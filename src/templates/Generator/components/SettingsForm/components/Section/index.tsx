import type { ReactNode } from 'react';
import { Aside } from './components/Aside';
import { Header } from './components/Header';
import { Title } from './components/Title';

/** A group of settings under a small heading, with context on the right. */
export const Section = ({
  title,
  aside,
  children,
}: {
  title: string;
  aside?: string;
  children: ReactNode;
}) => (
  <section aria-label={title}>
    <Header>
      <Title>{title}</Title>
      {aside && <Aside>{aside}</Aside>}
    </Header>
    {children}
  </section>
);
