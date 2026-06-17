import React from 'react';
import { cn } from '../../utils/cn';

type SkeletonVariant = 'text' | 'rect' | 'circle';

interface SkeletonProps {
  className?: string;
  variant?: SkeletonVariant;
  width?: string;
  height?: string;
}

const variantStyles: Record<SkeletonVariant, string> = {
  text: 'h-4 rounded',
  rect: 'rounded-2xl',
  circle: 'rounded-full',
};

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'text',
  width,
  height,
}) => {
  return (
    <div
      className={cn(
        'bg-surface-muted animate-pulse',
        variantStyles[variant],
        variant === 'text' && width,
        height,
        className
      )}
    />
  );
};

interface SkeletonListProps {
  count?: number;
  className?: string;
  variant?: SkeletonVariant;
  width?: string;
  height?: string;
  gap?: string;
}

export const SkeletonList: React.FC<SkeletonListProps> = ({
  count = 3,
  className,
  variant = 'rect',
  width,
  height,
  gap = 'space-y-3',
}) => {
  return (
    <div className={cn(gap, className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          variant={variant}
          width={width}
          height={height}
        />
      ))}
    </div>
  );
};

export default Skeleton;
