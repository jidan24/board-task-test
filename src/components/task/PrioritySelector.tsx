import React from 'react';
import { IonSelect, IonSelectOption } from '@ionic/react';
import type { Priority } from '../../types';

interface PrioritySelectorProps {
  value?: Priority;
  onChange: (value: Priority | undefined) => void;
}

export const PrioritySelector: React.FC<PrioritySelectorProps> = ({ value, onChange }) => {
  const getColor = (p?: Priority) => {
    switch (p) {
      case 'Low': return 'var(--ion-color-success, #2dd36f)';
      case 'Medium': return 'var(--ion-color-warning, #ffc409)';
      case 'High': return 'var(--ion-color-danger, #eb445a)';
      default: return 'transparent';
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px', 
      backgroundColor: 'var(--ion-color-light, #f4f5f8)',
      padding: '0 12px',
      borderRadius: '8px',
      height: '36px'
    }}>
      {value && (
        <div style={{ 
          width: '10px', 
          height: '10px', 
          borderRadius: '50%', 
          backgroundColor: getColor(value),
          flexShrink: 0
        }} />
      )}
      <IonSelect 
        value={value} 
        onIonChange={(e) => onChange(e.detail.value)}
        placeholder="Priority"
        interface="popover"
        style={{ 
          minHeight: '36px', 
          height: '36px',
          width: '100%', 
          margin: 0, 
          fontSize: "14px",
          "--padding-start": "0",
          "--padding-end": "0",
          "--padding-top": "0",
          "--padding-bottom": "0",
        }}
      >
        <IonSelectOption value="Low">Low</IonSelectOption>
        <IonSelectOption value="Medium">Medium</IonSelectOption>
        <IonSelectOption value="High">High</IonSelectOption>
      </IonSelect>
    </div>
  );
};
