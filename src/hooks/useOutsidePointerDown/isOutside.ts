/** Whether an event's target lies outside the container, or there is none. */
export const isOutside = (
  container: Pick<Node, 'contains'> | null,
  target: EventTarget | null,
) => !container?.contains(target as Node | null);
