import React from 'react';
import Button from './Button';

const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      {Icon && (
        <div className="mx-auto h-12 w-12 text-gray-300 mb-4 bg-gray-50 rounded-full flex items-center justify-center">
            <Icon className="h-6 w-6" />
        </div>
      )}
      <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-6">
          <Button onClick={onAction} variant="secondary" size="sm">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
