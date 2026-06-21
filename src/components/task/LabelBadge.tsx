import React from 'react';
import { IonBadge } from '@ionic/react';
import type { Label } from '../../types';

interface LabelBadgeProps {
  label: Label;
}

export const LabelBadge: React.FC<LabelBadgeProps> = ({ label }) => {
  const getColors = (l: Label) => {
    switch (l) {
      case 'Feature': 
        return { bg: 'rgba(var(--ion-color-primary-rgb, 56, 128, 255), 0.1)', color: 'var(--ion-color-primary, #3880ff)' };
      case 'Bug': 
        return { bg: 'rgba(var(--ion-color-danger-rgb, 235, 68, 90), 0.1)', color: 'var(--ion-color-danger, #eb445a)' };
      case 'Issue': 
        return { bg: 'rgba(var(--ion-color-warning-rgb, 255, 196, 9), 0.1)', color: 'var(--ion-color-warning-shade, #e0ac08)' };
      case 'Undefined': 
      default:
        return { bg: 'rgba(var(--ion-color-medium-rgb, 146, 148, 156), 0.1)', color: 'var(--ion-color-medium, #92949c)' };
    }
  };

  const colors = getColors(label);

  return (
    <IonBadge 
      style={{
        backgroundColor: colors.bg,
        color: colors.color,
        borderRadius: '12px', 
        padding: '6px 10px', 
        fontWeight: '600',
        fontSize: '11px',
        textTransform: 'none',
        boxShadow: 'none', // Remove default IonBadge shadow to match flat pill style
        display: 'inline-block'
      }}
    >
      {label}
    </IonBadge>
  );
};
