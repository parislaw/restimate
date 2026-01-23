import styles from './Card.module.css';

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  onClick,
  className = '',
  ...props
}) {
  const classNames = [
    styles.card,
    styles[variant],
    styles[`padding-${padding}`],
    hoverable && styles.hoverable,
    onClick && styles.clickable,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classNames}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`${styles.cardHeader} ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`${styles.cardTitle} ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={`${styles.cardDescription} ${className}`}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`${styles.cardContent} ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`${styles.cardFooter} ${className}`}>
      {children}
    </div>
  );
}
