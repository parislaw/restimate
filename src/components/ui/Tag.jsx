import styles from './Tag.module.css';

export function Tag({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
}) {
  const classNames = [
    styles.tag,
    styles[variant],
    styles[size],
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={classNames}>
      {children}
    </span>
  );
}
