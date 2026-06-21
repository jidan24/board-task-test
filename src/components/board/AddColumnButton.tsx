import React, { useState } from 'react';
import { IonButton, IonIcon, IonInput } from '@ionic/react';
import { addOutline, closeOutline } from 'ionicons/icons';
import { useBoardStore } from '../../store/boardStore';

export const AddColumnButton: React.FC = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const addColumn = useBoardStore(state => state.addColumn);

  const handleSubmit = () => {
    if (title.trim()) {
      addColumn(title.trim());
      setTitle('');
      setIsAdding(false);
    }
  };

  if (isAdding) {
    return (
      <div style={{ 
        width: '300px', 
        maxWidth: '85vw',
        minWidth: '280px',
        flexShrink: 0, 
        backgroundColor: 'var(--ion-color-step-50, #f4f5f8)',
        borderRadius: '12px',
        padding: '8px 12px',
        marginRight: '16px'
      }}>
        <IonInput
          value={title}
          onIonChange={e => setTitle(e.detail.value!)}
          placeholder="Enter list title..."
          autoFocus
          onKeyDown={e => {
            if (e.key === 'Enter') handleSubmit();
            if (e.key === 'Escape') setIsAdding(false);
          }}
          style={{ backgroundColor: '#fff', padding: '8px', borderRadius: '8px', marginBottom: '8px' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IonButton onClick={handleSubmit} size="small" style={{ textTransform: 'none' }}>
            Add list
          </IonButton>
          <IonButton fill="clear" color="medium" onClick={() => setIsAdding(false)}>
            <IonIcon icon={closeOutline} />
          </IonButton>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      width: '300px', 
      maxWidth: '85vw',
      minWidth: '280px', 
      flexShrink: 0, 
      marginRight: '16px' 
    }}>
      <IonButton 
        expand="block" 
        style={{ 
          '--background': 'var(--ion-color-light, #f4f5f8)', 
          '--background-hover': 'var(--ion-color-step-100, #e8eaf0)',
          '--color': 'var(--ion-text-color)', 
          '--border-radius': '12px',
          '--box-shadow': 'none',
          textTransform: 'none',
          fontWeight: 'bold',
          height: '48px',
          margin: 0
        }}
        onClick={() => setIsAdding(true)}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <IonIcon icon={addOutline} />
          <span>Add new List</span>
        </div>
      </IonButton>
    </div>
  );
};
