/**
 * Server-side Button component (returns an HTML string).
 *
 * The placeholder homepage and the Worker can both call this to render
 * a brand-styled button without shipping a JS framework to the client.
 */

export type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps {
  label: string;
  href?: string;
  type?: "button" | "submit";
  variant?: ButtonVariant;
  id?: string;
}

const escape = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export function Button(props: ButtonProps): string {
  const variant = props.variant ?? "primary";
  const cls = `btn btn--${variant}`;
  const id = props.id ? ` id="${escape(props.id)}"` : "";
  if (props.href) {
    return `<a class="${cls}"${id} href="${escape(props.href)}">${escape(props.label)}</a>`;
  }
  const t = props.type ?? "button";
  return `<button class="${cls}"${id} type="${t}">${escape(props.label)}</button>`;
}
