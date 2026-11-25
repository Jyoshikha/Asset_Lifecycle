'use client';

import { useState } from 'react';
import type { Option } from '@/types/odata';
import { Button } from './Button';
import { Dialog } from './Dialog';
import { Field, SelectInput, TextArea, TextInput } from './Field';
import { Notice } from './Notice';
import { Text } from './Text';
import styles from './FormDialog.module.css';

export type FieldDef = {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea';
  required?: boolean;
  options?: Option[];
  hint?: string;
  placeholder?: string;
  maxLength?: number;
};

type Props = {
  open: boolean;
  title: string;
  description?: string;
  fields: FieldDef[];
  initial?: Record<string, string>;
  submitLabel: string;
  danger?: boolean;
  /** Throw an Error to keep the dialog open and show its message. */
  onSubmit: (values: Record<string, string>) => Promise<void>;
  onClose: () => void;
};

function FormBody({ description, fields, initial, submitLabel, danger, onSubmit, onClose }: Omit<Props, 'open' | 'title'>) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.name, initial?.[f.name] ?? ''])),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [failure, setFailure] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (name: string, value: string) => setValues((v) => ({ ...v, [name]: value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const found: Record<string, string> = {};
    for (const f of fields) {
      const v = (values[f.name] ?? '').trim();
      if (f.required && !v) found[f.name] = 'This field is required.';
      else if (f.type === 'number' && v && Number.isNaN(Number(v))) found[f.name] = 'Enter a number.';
    }
    setErrors(found);
    if (Object.keys(found).length) return;

    setBusy(true);
    setFailure('');
    try {
      await onSubmit(values);
      onClose();
    } catch (err) {
      setFailure(err instanceof Error ? err.message : 'The request failed.');
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate className={styles.form}>
      {description && <Text tone="muted">{description}</Text>}
      {failure && <Notice tone="error">{failure}</Notice>}
      {fields.map((f) => {
        const id = `field-${f.name}`;
        const common = {
          id,
          name: f.name,
          value: values[f.name] ?? '',
          'aria-invalid': errors[f.name] ? true : undefined,
          'aria-describedby': errors[f.name] || f.hint ? `${id}-msg` : undefined,
          required: f.required,
        } as const;
        return (
          <Field key={f.name} label={f.required ? `${f.label} *` : f.label} htmlFor={id} error={errors[f.name]} hint={f.hint}>
            {f.type === 'select' ? (
              <SelectInput {...common} options={f.options ?? []} placeholder="Select…" onChange={(e) => set(f.name, e.target.value)} />
            ) : f.type === 'textarea' ? (
              <TextArea {...common} maxLength={f.maxLength} placeholder={f.placeholder} onChange={(e) => set(f.name, e.target.value)} />
            ) : (
              <TextInput
                {...common}
                type={f.type === 'number' ? 'text' : f.type}
                inputMode={f.type === 'number' ? 'decimal' : undefined}
                maxLength={f.maxLength}
                placeholder={f.placeholder}
                onChange={(e) => set(f.name, e.target.value)}
              />
            )}
          </Field>
        );
      })}
      <div className={styles.actions}>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant={danger ? 'danger' : 'primary'} busy={busy}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

export function FormDialog({ open, title, ...rest }: Props) {
  return (
    <Dialog open={open} title={title} onClose={rest.onClose}>
      <FormBody {...rest} />
    </Dialog>
  );
}
