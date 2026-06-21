import React from 'react';

interface EmptyStateProps {
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message = 'No data available' }) => {
  return (
    <div style={{ 
      padding: '32px 16px', 
      textAlign: 'center', 
      color: 'var(--ion-color-medium)',
      backgroundColor: 'rgba(0,0,0,0.02)',
      borderRadius: '8px',
      border: '1px dashed var(--ion-color-step-150)',
      fontSize: '14px'
    }}>
      {message}
    </div>
  );
};
