/**
 * Server-side Card component (returns an HTML string).
 */

export interface CardProps {
  title?: string;
  body: string; // pre-escaped HTML
  footer?: string; // pre-escaped HTML
  id?: string;
}

const escape = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export function Card(props: CardProps): string {
  const id = props.id ? ` id="${escape(props.id)}"` : "";
  const title = props.title ? `<h3 class="card__title">${escape(props.title)}</h3>` : "";
  const footer = props.footer ? `<div class="card__footer">${props.footer}</div>` : "";
  return `<section class="card"${id}>${title}<div class="card__body">${props.body}</div>${footer}</section>`;
}
