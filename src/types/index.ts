export type Label = 'Feature' | 'Bug' | 'Issue' | 'Undefined';

export type Priority = 'Low' | 'Medium' | 'High';

export interface Member {
  id: string;
  name: string;
  avatarUrl?: string;
  initials: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  isDone: boolean;
}

export interface Attachment {
  id: string;
  fileName: string;
  fileType: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeIds: string[];
  dueDate: string | null;
  label: Label;
  priority?: Priority;
  checklist: ChecklistItem[];
  attachments: Attachment[];
  coverImageUrl?: string;
  columnId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  title: string;
  order: number;
  taskIds: string[];
}

export interface BoardState {
  columns: Record<string, Column>;
  tasks: Record<string, Task>;
  members: Member[];
}
