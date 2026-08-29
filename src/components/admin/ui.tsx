'use client';

import { ReactNode } from 'react';

/* Shared admin UI primitives — dark theme, consistent with the panel. */

export const inputCls =
  'w-full rounded-lg border border-border bg-bgDark px-3 py-2 text-sm text-textMain placeholder:text-textMuted/50 transition-colors focus:border-primary focus:outline-none';

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-textMuted">{label}</label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-textMuted/70">{hint}</p>}
    </div>
  );
}

export function Text({
  label,
  value,
  onChange,
  placeholder,
  required,
  type = 'text',
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
      />
    </Field>
  );
}

export function Area({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
  hint,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <Field label={label} hint={hint}>
      <textarea
        value={value}
        rows={rows}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputCls} resize-y`}
      />
    </Field>
  );
}

export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <Field label={label}>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-textMuted">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[#22c55e]"
      />
      {label}
    </label>
  );
}

export function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <Field label={label}>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={inputCls}
      />
    </Field>
  );
}

export function ListEditor({
  label,
  items,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  hint?: string;
}) {
  const add = () => onChange([...items, '']);
  const update = (i: number, v: string) => onChange(items.map((it, idx) => (idx === i ? v : it)));
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const next = [...items];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <Field label={label} hint={hint}>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <input
              type="text"
              value={item}
              placeholder={placeholder}
              onChange={(e) => update(i, e.target.value)}
              className={inputCls}
            />
            <button
              type="button"
              onClick={() => move(i, -1)}
              aria-label="Move up"
              className="h-8 w-8 shrink-0 rounded border border-border text-textMuted hover:text-textMain"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => move(i, 1)}
              aria-label="Move down"
              className="h-8 w-8 shrink-0 rounded border border-border text-textMuted hover:text-textMain"
            >
              ↓
            </button>
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Remove item"
              className="h-8 w-8 shrink-0 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="rounded-lg border border-border px-3 py-1.5 text-sm text-textMuted transition-colors hover:border-primary/40 hover:text-textMain"
        >
          + Add item
        </button>
      </div>
    </Field>
  );
}

export function Card({ title, children, actions }: { title?: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-bgCard p-6">
      {(title || actions) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h2 className="text-lg font-bold text-textMain">{title}</h2>}
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

export function Notice({ kind, message }: { kind: 'ok' | 'error'; message: string }) {
  if (!message) return null;
  return (
    <div
      role={kind === 'error' ? 'alert' : 'status'}
      className={`rounded-lg border px-4 py-3 text-sm ${
        kind === 'ok'
          ? 'border-primary/25 bg-primary/8 text-primary'
          : 'border-red-500/30 bg-red-500/10 text-red-400'
      }`}
    >
      {message}
    </div>
  );
}

export function SubmitButton({ loading, children = 'Save' }: { loading: boolean; children?: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-textMain transition-colors hover:bg-primaryDark disabled:pointer-events-none disabled:opacity-50"
    >
      {loading ? 'Saving…' : children}
    </button>
  );
}

export function RowActions({
  onEdit,
  onDelete,
  deleteLabel = 'Delete',
}: {
  onEdit: () => void;
  onDelete: () => void;
  deleteLabel?: string;
}) {
  return (
    <div className="flex shrink-0 gap-2">
      <button
        type="button"
        onClick={onEdit}
        className="rounded bg-primary/15 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/25"
      >
        Edit
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="rounded bg-red-600/15 px-3 py-1.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-600/25"
      >
        {deleteLabel}
      </button>
    </div>
  );
}

export function EmptyRow({ children }: { children: ReactNode }) {
  return <p className="py-6 text-center text-sm text-textMuted">{children}</p>;
}

export function Panel({ children }: { children: ReactNode }) {
  return <div className="space-y-6">{children}</div>;
}
