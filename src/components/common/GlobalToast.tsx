import React from 'react';
import { IonToast } from '@ionic/react';
import { useToastStore } from '../../store/toastStore';

export const GlobalToast: React.FC = () => {
  const { isOpen, message, color, hideToast } = useToastStore();

  return (
    <IonToast
      isOpen={isOpen}
      message={message}
      color={color}
      duration={2000}
      onDidDismiss={hideToast}
      position="bottom"
      cssClass="custom-toast"
      buttons={[
        {
          text: 'Dismiss',
          role: 'cancel',
        }
      ]}
    />
  );
};
