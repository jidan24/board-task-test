import React, { useState } from 'react';
import { IonProgressBar, IonCheckbox, IonButton, IonIcon, IonInput } from '@ionic/react';
import { trashOutline, addOutline, checkmarkOutline, closeOutline } from 'ionicons/icons';
import type { ChecklistItem } from '../../types';

interface ChecklistSectionProps {
  checklist: ChecklistItem[];
  onChange: (checklist: ChecklistItem[]) => void;
}

export const ChecklistSection: React.FC<ChecklistSectionProps> = ({ checklist, onChange }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newItemText, setNewItemText] = useState('');

  const completed = checklist.filter(c => c.isDone).length;
  const total = checklist.length;
  const progress = total > 0 ? completed / total : 0;

  const toggleItem = (id: string) => {
    onChange(checklist.map(c => c.id === id ? { ...c, isDone: !c.isDone } : c));
  };

  const deleteItem = (id: string) => {
    onChange(checklist.filter(c => c.id !== id));
  };

  const handleAdd = () => {
    if (newItemText.trim()) {
      const newItem: ChecklistItem = {
        id: `chk-${Math.random().toString(36).substr(2, 9)}`,
        text: newItemText.trim(),
        isDone: false
      };
      onChange([...checklist, newItem]);
    }
    setNewItemText('');
    setIsAdding(false);
  };

  return (
    <div>
      <div style={{ fontSize: '12px', color: 'var(--ion-color-medium)', marginBottom: '8px' }}>
        {completed}/{total}
      </div>
      <IonProgressBar 
        value={progress} 
        color="primary" 
        style={{ marginBottom: '16px', borderRadius: '4px', height: '4px', backgroundColor: 'var(--ion-color-step-150)' }} 
      />
      
      {checklist.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          {checklist.map(item => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <IonCheckbox checked={item.isDone} onIonChange={() => toggleItem(item.id)} justify="start" />
              <span style={{ marginLeft: '12px', flex: 1, fontSize: '14px', textDecoration: item.isDone ? 'line-through' : 'none', color: item.isDone ? 'var(--ion-color-medium)' : 'inherit' }}>
                {item.text}
              </span>
              <IonButton fill="clear" color="medium" size="small" onClick={() => deleteItem(item.id)} style={{ margin: 0 }}>
                <IonIcon icon={trashOutline} />
              </IonButton>
            </div>
          ))}
        </div>
      )}

      {isAdding ? (
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--ion-color-light, #f4f5f8)', borderRadius: '8px', padding: '4px 8px' }}>
          <IonInput
            autofocus
            value={newItemText}
            onIonChange={e => setNewItemText(e.detail.value!)}
            placeholder="What needs to be done?"
            onKeyDown={e => {
              if (e.key === 'Enter') handleAdd();
              if (e.key === 'Escape') setIsAdding(false);
            }}
            style={{ flex: 1, fontSize: '14px' }}
          />
          <IonButton fill="clear" color="success" onClick={handleAdd} style={{ margin: 0 }}>
            <IonIcon icon={checkmarkOutline} />
          </IonButton>
          <IonButton fill="clear" color="medium" onClick={() => setIsAdding(false)} style={{ margin: 0 }}>
            <IonIcon icon={closeOutline} />
          </IonButton>
        </div>
      ) : (
        <IonButton 
          expand="block"
          style={{ 
            '--background': 'var(--ion-color-light, #f4f5f8)',
            '--color': 'var(--ion-text-color)',
            '--box-shadow': 'none',
            '--border-radius': '8px',
            textTransform: 'none',
            margin: 0,
            height: '40px',
            fontSize: '14px'
          }}
          onClick={() => setIsAdding(true)}
        >
          <IonIcon icon={addOutline} slot="start" />
          Add subtask
        </IonButton>
      )}
    </div>
  );
};
