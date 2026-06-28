import React, { useState } from 'react';
import { 
  IonButton, 
  IonIcon, 
  IonPopover, 
  IonCheckbox, 
  IonContent, 
  IonDatetime, 
  IonDatetimeButton, 
  IonModal 
} from '@ionic/react';
import { filterOutline, checkmarkOutline } from 'ionicons/icons';
import { useBoardStore } from '../../store/boardStore';
import { useBoardFilters } from '../../hooks/useBoardFilters';
import type { Label } from '../../types';
import { Avatar } from '../common/Avatar';
import { LabelBadge } from '../task/LabelBadge';

const LABELS: Label[] = ['Feature', 'Bug', 'Issue', 'Undefined'];

export const FilterBar: React.FC = () => {
  const store = useBoardStore();
  const filters = useBoardFilters();
  const [showPopover, setShowPopover] = useState(false);
  const [popoverEvent, setPopoverEvent] = useState<Event | null>(null);

  const toggleAssignee = (id: string) => {
    const current = filters.filterAssigneeIds;
    if (current.includes(id)) {
      filters.setFilterAssigneeIds(current.filter(x => x !== id).length > 0 ? current.filter(x => x !== id) : null);
    } else {
      filters.setFilterAssigneeIds([...current, id]);
    }
  };

  const toggleLabel = (label: Label) => {
    const current = filters.filterLabels;
    if (current.includes(label)) {
      filters.setFilterLabels(current.filter(x => x !== label).length > 0 ? current.filter(x => x !== label) : null);
    } else {
      filters.setFilterLabels([...current, label]);
    }
  };

  const setDateFrom = (date: string | null) => {
    const newRange = { ...filters.filterDueDateRange, from: date };
    filters.setFilterDueDateRange((newRange.from || newRange.to) ? newRange : null);
  };
  const setDateTo = (date: string | null) => {
    const newRange = { ...filters.filterDueDateRange, to: date };
    filters.setFilterDueDateRange((newRange.from || newRange.to) ? newRange : null);
  };

  const activeFilterCount = filters.filterAssigneeIds.length + filters.filterLabels.length + (filters.filterDueDateRange.from ? 1 : 0) + (filters.filterDueDateRange.to ? 1 : 0);

  return (
    <>
      <div 
        onClick={(e) => {
          e.persist();
          setPopoverEvent(e.nativeEvent);
          setShowPopover(true);
        }}
        style={{ 
          display: 'flex', alignItems: 'center', gap: '8px', 
          cursor: 'pointer', height: '36px', padding: '0 12px',
          borderRadius: '8px', 
          backgroundColor: activeFilterCount > 0 ? 'var(--ion-color-primary)' : 'transparent',
          color: activeFilterCount > 0 ? 'var(--ion-color-primary-contrast)' : 'var(--ion-text-color)'
        }}
      >
        <IonIcon icon={filterOutline} />
        <span className="ion-hide-md-down" style={{ fontSize: '14px', fontWeight: '500' }}>Filter {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
      </div>

      <IonPopover
        isOpen={showPopover}
        event={popoverEvent || undefined}
        onDidDismiss={() => { setShowPopover(false); setPopoverEvent(null); }}
        style={{ '--min-width': '320px', '--border-radius': '16px' }}
      >
        <IonContent className="ion-padding">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Filters</h3>
            {activeFilterCount > 0 && (
              <IonButton fill="clear" color="primary" size="small" onClick={() => filters.clearFilters()} style={{ textTransform: 'none', margin: 0 }}>
                Reset
              </IonButton>
            )}
          </div>

          {/* Members Filter */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--ion-color-medium)', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Members</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {store.members.map(member => (
                <div 
                  key={member.id} 
                  onClick={() => toggleAssignee(member.id)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', backgroundColor: filters.filterAssigneeIds.includes(member.id) ? 'rgba(56, 128, 255, 0.1)' : 'transparent', transition: 'background-color 0.2s' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Avatar member={member} size="sm" />
                    <span style={{ fontSize: '14px', fontWeight: '500', color: filters.filterAssigneeIds.includes(member.id) ? 'var(--ion-color-primary)' : 'var(--ion-text-color)' }}>{member.name}</span>
                  </div>
                  <IonCheckbox checked={filters.filterAssigneeIds.includes(member.id)} onIonChange={(e) => { e.preventDefault(); /* handled by parent click */ }} />
                </div>
              ))}
            </div>
          </div>

          {/* Labels Filter */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--ion-color-medium)', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Labels</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {LABELS.map(label => {
                const isActive = filters.filterLabels.includes(label);
                return (
                  <div 
                    key={label} 
                    onClick={() => toggleLabel(label)}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '8px', 
                      padding: '4px 8px', borderRadius: '8px', 
                      backgroundColor: isActive ? 'rgba(56, 128, 255, 0.1)' : 'transparent',
                      cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    <LabelBadge label={label} />
                    {isActive && <IonIcon icon={checkmarkOutline} style={{ color: 'var(--ion-color-primary)', fontSize: '16px' }} />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Due Date Filter */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--ion-color-medium)', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Due Date</h4>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1, backgroundColor: 'var(--ion-color-step-50, rgba(128,128,128,0.05))', padding: '8px 12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: 'var(--ion-color-medium)', marginBottom: '8px' }}>From</div>
                <IonDatetimeButton datetime="datetime-from" style={{ minHeight: 'auto', margin: 0 }} />
                <IonModal keepContentsMounted={true}>
                  <IonDatetime 
                    id="datetime-from" 
                    presentation="date"
                    value={filters.filterDueDateRange.from || undefined}
                    onIonChange={e => setDateFrom(e.detail.value as string)}
                    showClearButton={true}
                  />
                </IonModal>
              </div>
              <div style={{ flex: 1, backgroundColor: 'var(--ion-color-step-50, rgba(128,128,128,0.05))', padding: '8px 12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: 'var(--ion-color-medium)', marginBottom: '8px' }}>To</div>
                <IonDatetimeButton datetime="datetime-to" style={{ minHeight: 'auto', margin: 0 }} />
                <IonModal keepContentsMounted={true}>
                  <IonDatetime 
                    id="datetime-to" 
                    presentation="date"
                    value={filters.filterDueDateRange.to || undefined}
                    onIonChange={e => setDateTo(e.detail.value as string)}
                    showClearButton={true}
                  />
                </IonModal>
              </div>
            </div>
          </div>

        </IonContent>
      </IonPopover>
    </>
  );
};
