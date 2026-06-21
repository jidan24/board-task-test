import { create } from 'zustand';

interface ToastState {
  isOpen: boolean;
  message: string;
  color: 'success' | 'danger' | 'warning' | 'primary' | 'medium';
  showToast: (message: string, color?: 'success' | 'danger' | 'warning' | 'primary' | 'medium') => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  isOpen: false,
  message: '',
  color: 'success',
  showToast: (message, color = 'success') => set({ isOpen: true, message, color }),
  hideToast: () => set({ isOpen: false }),
}));
