import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { documentTextOutline, imageOutline, attachOutline, trashOutline, documentAttachOutline } from 'ionicons/icons';
import type { Attachment } from '../../types';

interface AttachmentSectionProps {
  attachments: Attachment[];
  onChange: (attachments: Attachment[]) => void;
}

const DUMMY_FILES = [
  { fileName: 'design-mockup.fig', fileType: 'fig' },
  { fileName: 'requirement-doc.pdf', fileType: 'pdf' },
  { fileName: 'screenshot.png', fileType: 'png' },
  { fileName: 'video-record.mp4', fileType: 'mp4' },
  { fileName: 'client-assets.zip', fileType: 'zip' },
];

export const AttachmentSection: React.FC<AttachmentSectionProps> = ({ attachments, onChange }) => {
  const handleDummyUpload = () => {
    const randomFile = DUMMY_FILES[Math.floor(Math.random() * DUMMY_FILES.length)];
    const newAttachment: Attachment = {
      id: `att-${Math.random().toString(36).substr(2, 9)}`,
      fileName: randomFile.fileName,
      fileType: randomFile.fileType,
    };
    onChange([...attachments, newAttachment]);
  };

  const deleteAttachment = (id: string) => {
    onChange(attachments.filter(a => a.id !== id));
  };

  const getIconForType = (type: string) => {
    switch(type) {
      case 'pdf': case 'doc': case 'txt': return documentTextOutline;
      case 'png': case 'jpg': case 'jpeg': case 'fig': return imageOutline;
      default: return attachOutline;
    }
  };

  return (
    <div>
      <div 
        onClick={handleDummyUpload}
        style={{ 
          border: '1px dashed var(--ion-color-step-150, #e0e0e0)', 
          borderRadius: '8px', 
          padding: '16px', 
          textAlign: 'center', 
          backgroundColor: 'var(--ion-color-light, #f4f5f8)', 
          fontSize: '12px', 
          fontWeight: '500',
          cursor: 'pointer',
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <IonIcon icon={documentAttachOutline} style={{ color: 'var(--ion-color-medium)', fontSize: '16px' }} />
        <span style={{ color: 'var(--ion-color-medium)' }}>
          Drag & Drop files here <span style={{ fontWeight: 'normal', margin: '0 4px' }}>or</span> <span style={{ color: 'var(--ion-color-primary)' }}>browse from device</span>
        </span>
      </div>
      
      {attachments.map(att => (
        <div key={att.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', padding: '8px', backgroundColor: 'var(--ion-color-light, #f4f5f8)', borderRadius: '8px' }}>
          <IonIcon icon={getIconForType(att.fileType)} style={{ fontSize: '24px', color: 'var(--ion-color-medium)' }} />
          <span style={{ marginLeft: '12px', flex: 1, fontSize: '14px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {att.fileName}
          </span>
          <IonButton fill="clear" color="medium" size="small" onClick={() => deleteAttachment(att.id)} style={{ margin: 0 }}>
            <IonIcon icon={trashOutline} />
          </IonButton>
        </div>
      ))}
    </div>
  );
};
