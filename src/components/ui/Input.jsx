import styles from './Input.module.css';

export function Input({
  type = 'text',
  label,
  error,
  hint,
  id,
  className = '',
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`${styles.inputWrapper} ${className}`}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        className={`${styles.input} ${error ? styles.error : ''}`}
        {...props}
      />
      {hint && !error && (
        <span className={styles.hint}>{hint}</span>
      )}
      {error && (
        <span className={styles.errorMessage}>{error}</span>
      )}
    </div>
  );
}

export function Select({
  label,
  error,
  hint,
  id,
  children,
  className = '',
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`${styles.inputWrapper} ${className}`}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={`${styles.input} ${styles.select} ${error ? styles.error : ''}`}
        {...props}
      >
        {children}
      </select>
      {hint && !error && (
        <span className={styles.hint}>{hint}</span>
      )}
      {error && (
        <span className={styles.errorMessage}>{error}</span>
      )}
    </div>
  );
}

export function TextArea({
  label,
  error,
  hint,
  id,
  rows = 4,
  className = '',
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`${styles.inputWrapper} ${className}`}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        className={`${styles.input} ${styles.textarea} ${error ? styles.error : ''}`}
        {...props}
      />
      {hint && !error && (
        <span className={styles.hint}>{hint}</span>
      )}
      {error && (
        <span className={styles.errorMessage}>{error}</span>
      )}
    </div>
  );
}
