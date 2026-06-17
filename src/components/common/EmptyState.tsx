import React from 'react';

import { Avatar, Button } from '../ui';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
      <Avatar size="lg" variant="secondary" className="mb-4">
        {icon || '📭'}
      </Avatar>
      <h3 className="font-medium text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted mb-6 max-w-xs">{description}</p>
      )}
      {action && (
        <Button variant="primary" size="md" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
