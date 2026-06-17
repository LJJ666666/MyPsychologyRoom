import React from 'react';
import { cn } from '../../utils/cn';

type CardPadding = 'none' | 'sm' | 'md' | 'lg';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: CardPadding;
  hoverable?: boolean;
  onClick?: () => void;
}

const paddingStyles: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
};

export const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = 'md',
  hoverable = false,
  onClick,
}) => {
  const Tag: React.ElementType = onClick ? 'div' : 'div';
  return (
    <Tag
      onClick={onClick}
      className={cn(
        'bg-surface rounded-2xl shadow-card',
        paddingStyles[padding],
        hoverable && 'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer transition-all',
        className
      )}
    >
      {children}
    </Tag>
  );
};

export default Card;
