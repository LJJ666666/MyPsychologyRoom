import React from 'react';
import { cn } from '../../utils/cn';

type AvatarSize = 'sm' | 'md' | 'lg';
type AvatarVariant = 'primary' | 'secondary';

interface AvatarProps {
  children: React.ReactNode;
  size?: AvatarSize;
  className?: string;
  variant?: AvatarVariant;
}

const sizeStyles: Record<AvatarSize, string> = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-xl',
  lg: 'w-12 h-12 text-2xl',
};

const variantStyles: Record<AvatarVariant, string> = {
  primary: 'bg-primary/10 text-primary-dark',
  secondary: 'bg-secondary text-muted',
};

export const Avatar: React.FC<AvatarProps> = ({
  children,
  size = 'md',
  className,
  variant = 'secondary',
}) => {
  return (
    <div
      className={cn(
        'rounded-full inline-flex items-center justify-center flex-shrink-0',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
    >
      {children}
    </div>
  );
};

export default Avatar;
