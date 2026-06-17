import React from 'react';
import { cn } from '../../utils/cn';

type DividerOrientation = 'horizontal' | 'vertical';

interface DividerProps {
  className?: string;
  orientation?: DividerOrientation;
  withText?: boolean;
  children?: React.ReactNode;
}

const orientationStyles: Record<DividerOrientation, string> = {
  horizontal: 'h-px w-full bg-divider',
  vertical: 'w-px h-full bg-divider',
};

export const Divider: React.FC<DividerProps> = ({
  className,
  orientation = 'horizontal',
  withText = false,
  children,
}) => {
  if (withText && orientation === 'horizontal' && children) {
    return (
      <div className={cn('flex items-center gap-3 my-2', className)}>
        <div className="flex-1 h-px bg-divider" />
        <span className="text-xs text-muted">{children}</span>
        <div className="flex-1 h-px bg-divider" />
      </div>
    );
  }

  return <div className={cn(orientationStyles[orientation], className)} />;
};

export default Divider;
