import React, { useState } from 'react';
import { IonIcon, IonPopover, IonCheckbox } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import { useBoardStore } from '../../store/boardStore';
import { AvatarGroup } from '../common/Avatar';

interface AssigneeSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export const AssigneeSelector: React.FC<AssigneeSelectorProps> = ({ value, onChange }) => {
  const members = useBoardStore(state => state.members);
  const [showPopover, setShowPopover] = useState(false);
  const [popoverEvent, setPopoverEvent] = useState<Event | null>(null);

  const selectedMembers = members.filter(m => value.includes(m.id));

  const toggleMember = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter(v => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <>
      <div 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
        onClick={(e) => {
          setPopoverEvent(e.nativeEvent);
          setShowPopover(true);
        }}
      >
        <AvatarGroup members={selectedMembers} max={4} size="md" />
        
        <div style={{ 
          width: '32px', height: '32px', borderRadius: '50%', 
          backgroundColor: 'var(--ion-color-light, #f4f5f8)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--ion-color-medium)',
          marginLeft: selectedMembers.length > 0 ? '4px' : '0'
        }}>
          <IonIcon icon={addOutline} />
        </div>
      </div>

      <IonPopover 
        isOpen={showPopover} 
        event={popoverEvent || undefined} 
        onDidDismiss={() => setShowPopover(false)}
        style={{ '--min-width': '250px' }}
      >
        <div style={{ padding: '8px 0' }}>
          {members.map(m => (
            <div 
              key={m.id}
              onClick={() => toggleMember(m.id)}
              style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                padding: '8px 16px', cursor: 'pointer',
                backgroundColor: value.includes(m.id) ? 'rgba(56, 128, 255, 0.1)' : 'transparent'
              }}
            >
              <span style={{ fontSize: '14px', color: value.includes(m.id) ? 'var(--ion-color-primary)' : 'var(--ion-text-color)' }}>{m.name}</span>
              <IonCheckbox checked={value.includes(m.id)} onIonChange={e => { e.preventDefault(); }} />
            </div>
          ))}
        </div>
      </IonPopover>
    </>
  );
};
