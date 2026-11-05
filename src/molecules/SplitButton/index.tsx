'use client';

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { Chevron } from '~/atoms/Chevron';
import { useOutsidePointerDown } from '~/hooks/useOutsidePointerDown';
import { Item } from './components/Item';
import { Main } from './components/Main';
import { Menu } from './components/Menu';
import { Toggle } from './components/Toggle';
import { Wrapper } from './components/Wrapper';

export interface SplitButtonItem {
  label: string;
  /** What the action gives, in a few words under its label. */
  hint?: string;
  onSelect: () => void;
  disabled?: boolean;
}

export interface SplitButtonProps {
  /** The main action's label. */
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  /** Spoken name of the caret, e.g. "More export options". */
  menuLabel: string;
  items: Array<SplitButtonItem>;
}

/**
 * A primary action with its alternatives folded behind a caret. The menu
 * follows the ARIA menu button pattern: arrows move, Escape or Tab closes, and
 * focus comes back to the caret after a choice.
 */
export const SplitButton = ({
  children,
  onClick,
  disabled = false,
  menuLabel,
  items,
}: SplitButtonProps) => {
  const menuId = useId();
  const wrapper = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);

  const entries = () =>
    Array.from(
      menu.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ??
        [],
    );

  useOutsidePointerDown(wrapper, open, () => setOpen(false));
  useEffect(() => {
    if (open) entries()[0]?.focus();
  }, [open]);

  const close = () => {
    setOpen(false);
    toggle.current?.focus();
  };

  const onMenuKey = (event: KeyboardEvent) => {
    const all = entries();
    const at = all.indexOf(document.activeElement as HTMLButtonElement);
    const moveTo = (index: number) => {
      event.preventDefault();
      all[(index + all.length) % all.length]?.focus();
    };
    if (event.key === 'ArrowDown') moveTo(at + 1);
    if (event.key === 'ArrowUp') moveTo(at - 1);
    if (event.key === 'Home') moveTo(0);
    if (event.key === 'End') moveTo(all.length - 1);
    if (event.key === 'Escape') {
      event.stopPropagation();
      close();
    }
    if (event.key === 'Tab') setOpen(false);
  };

  return (
    <Wrapper ref={wrapper}>
      <Main
        type="button"
        $variant="primary"
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </Main>
      <Toggle
        ref={toggle}
        type="button"
        $variant="primary"
        aria-label={menuLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen(!open)}
        onKeyDown={event => {
          if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        {/* Points the way the menu opens: up. */}
        <Chevron open={!open} />
      </Toggle>
      <Menu
        ref={menu}
        id={menuId}
        role="menu"
        aria-label={menuLabel}
        hidden={!open}
        onKeyDown={onMenuKey}
      >
        {items.map(item => (
          <li key={item.label} role="none">
            <Item
              type="button"
              role="menuitem"
              tabIndex={-1}
              aria-disabled={item.disabled || undefined}
              onClick={() => {
                if (item.disabled) return;
                close();
                item.onSelect();
              }}
            >
              {item.label}
              {item.hint && <small>{item.hint}</small>}
            </Item>
          </li>
        ))}
      </Menu>
    </Wrapper>
  );
};
