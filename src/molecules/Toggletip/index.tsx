'use client';

import { useId, useRef, useState, type ReactNode } from 'react';
import { useOutsidePointerDown } from '~/hooks/useOutsidePointerDown';
import { Panel } from './components/Panel';
import { Trigger } from './components/Trigger';
import { Wrapper } from './components/Wrapper';

export interface ToggletipProps {
  label: string;
  /** Text set before the trigger; the panel opens across both. */
  lead?: ReactNode;
  children: ReactNode;
}

/**
 * Help that opens while the mouse is over its trigger or panel, stays open after a click or tap, and
 * closes on Escape, an outside click, or focus moving elsewhere.
 */
export const Toggletip = ({ label, lead, children }: ToggletipProps) => {
  const panelId = useId();
  const wrapper = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const open = pinned || hovered;

  useOutsidePointerDown(wrapper, pinned, () => setPinned(false));

  const close = () => {
    setPinned(false);
    setHovered(false);
  };

  return (
    <Wrapper
      ref={wrapper}
      onPointerLeave={event => {
        if (event.pointerType === 'mouse') setHovered(false);
      }}
      onKeyDown={event => {
        if (event.key === 'Escape' && open) {
          event.stopPropagation();
          close();
        }
      }}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) close();
      }}
    >
      {lead}
      <Trigger
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onPointerEnter={event => {
          if (event.pointerType === 'mouse') setHovered(true);
        }}
        onClick={() => (pinned ? close() : setPinned(true))}
      >
        {label}
      </Trigger>
      <Panel id={panelId} hidden={!open}>
        {children}
      </Panel>
    </Wrapper>
  );
};
