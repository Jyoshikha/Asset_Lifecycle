import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import type { Option } from '@/types/odata';
import styles from './Field.module.css';

type FieldProps = { label: string; htmlFor: string; error?: string; hint?: string; children: React.ReactNode };

/** A label, a control and its message. Errors are announced and tied to the control by the caller's aria-describedby. */
export function Field({ label, htmlFor, error, hint, children }: FieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={htmlFor} className={styles.label}>
        {label}
      </label>
      {children}
      {error ? (
        <span id={`${htmlFor}-msg`} role="alert" className={styles.error}>
          {error}
        </span>
      ) : (
        hint && (
          <span id={`${htmlFor}-msg`} className={styles.hint}>
            {hint}
          </span>
        )
      )}
    </div>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={styles.control} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${styles.control} ${styles.area}`} />;
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { options: Option[]; placeholder?: string };

export function SelectInput({ options, placeholder, ...rest }: SelectProps) {
  return (
    <select {...rest} className={styles.control}>
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
