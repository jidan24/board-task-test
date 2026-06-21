import React, { useState } from 'react';
import { IonAvatar, IonText } from '@ionic/react';
import type { Member } from '../../types';

interface AvatarProps {
  member: Member;
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}

export const Avatar: React.FC<AvatarProps> = ({ member, size = 'md', style }) => {
  const [imgError, setImgError] = useState(false);

  const sizeMap = {
    sm: '24px',
    md: '32px',
    lg: '40px',
  };

  const dim = sizeMap[size];

  const baseStyle: React.CSSProperties = {
    width: dim,
    height: dim,
    border: '2px solid var(--ion-color-light, #f4f5f8)',
    backgroundColor: 'var(--ion-color-step-100, #f2f2f2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    overflow: 'hidden',
    ...style,
  };

  return (
    <IonAvatar style={baseStyle}>
      {!imgError && member.avatarUrl ? (
        <img 
          src={member.avatarUrl} 
          alt={member.name} 
          onError={() => setImgError(true)} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <IonText color="medium" style={{ fontSize: size === 'sm' ? '10px' : '14px', fontWeight: 'bold' }}>
          {member.initials}
        </IonText>
      )}
    </IonAvatar>
  );
};

interface AvatarGroupProps {
  members: Member[];
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({ members, max = 3, size = 'md' }) => {
  const visibleMembers = members.slice(0, max);
  const extraCount = members.length - max;
  
  const overlapMap = {
    sm: '-8px',
    md: '-10px',
    lg: '-12px',
  };

  const extraStyle: React.CSSProperties = {
    marginLeft: overlapMap[size],
    backgroundColor: 'var(--ion-color-primary, #3880ff)',
    color: 'var(--ion-color-primary-contrast, #fff)',
    zIndex: 10,
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {visibleMembers.map((member, index) => (
        <Avatar 
          key={member.id} 
          member={member} 
          size={size} 
          style={{ 
            marginLeft: index > 0 ? overlapMap[size] : 0, 
            zIndex: max - index 
          }} 
        />
      ))}
      {extraCount > 0 && (
        <div style={{
           width: size === 'sm' ? '24px' : size === 'md' ? '32px' : '40px',
           height: size === 'sm' ? '24px' : size === 'md' ? '32px' : '40px',
           borderRadius: '50%',
           border: '2px solid var(--ion-color-light, #f4f5f8)',
           ...extraStyle,
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           fontSize: size === 'sm' ? '10px' : '12px',
           fontWeight: 'bold',
        }}>
          +{extraCount}
        </div>
      )}
    </div>
  );
};
