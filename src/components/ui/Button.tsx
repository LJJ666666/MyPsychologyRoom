import React from 'react';
import { cn } from '../../utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  secondary: 'bg-secondary text-foreground hover:bg-secondary-dark',
  ghost: 'bg-transparent text-muted hover:text-foreground',
  outline: 'bg-transparent border border-border text-foreground',
  danger: 'bg-danger text-white hover:opacity-90',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'py-1.5 px-3 text-xs',
  md: 'py-2.5 px-5 text-sm',
  lg: 'py-3 px-6 text-base',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  children,
  className,
  onClick,
  ...rest
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        disabled && 'opacity-50 cursor-not-allowed',
        !disabled && 'cursor-pointer',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
