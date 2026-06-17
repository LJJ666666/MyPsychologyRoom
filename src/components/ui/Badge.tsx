import React from 'react';
import { cn } from '../../utils/cn';

type BadgeVariant = 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'default';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: 'bg-primary/10 text-primary-dark',
  accent: 'bg-accent/10 text-accent-dark',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-accent-dark',
  danger: 'bg-danger/10 text-danger',
  default: 'bg-surface-muted text-muted',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className,
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
