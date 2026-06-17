import React from 'react';
import { cn } from '../../utils/cn';

type TagVariant = 'default' | 'primary' | 'accent' | 'outline';
type TagSize = 'sm' | 'md';

interface TagProps {
  children: React.ReactNode;
  variant?: TagVariant;
  size?: TagSize;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
}

const baseStyles: Record<TagVariant, string> = {
  default: 'bg-surface-muted text-muted-foreground',
  primary: 'bg-primary/10 text-primary-dark',
  accent: 'bg-accent/10 text-accent-dark',
  outline: 'bg-transparent border border-border text-muted',
};

const selectedStyles: Record<TagVariant, string> = {
  default: 'bg-border text-foreground',
  primary: 'bg-primary/20 text-primary-dark',
  accent: 'bg-accent/20 text-accent-dark',
  outline: 'bg-surface-muted text-foreground',
};

const sizeStyles: Record<TagSize, string> = {
  sm: 'px-2 py-0.5 text-2xs',
  md: 'px-2.5 py-1 text-xs',
};

export const Tag: React.FC<TagProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  onClick,
  selected = false,
  disabled = false,
}) => {
  return (
    <span
      onClick={disabled ? undefined : onClick}
      className={cn(
        'inline-flex items-center rounded-full font-medium transition-colors',
        sizeStyles[size],
        selected ? selectedStyles[variant] : baseStyles[variant],
        onClick && !disabled && 'cursor-pointer',
        disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
        className
      )}
    >
      {children}
    </span>
  );
};

export default Tag;
