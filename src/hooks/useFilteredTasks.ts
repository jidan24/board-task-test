import { useBoardStore } from '../store/boardStore';
import { useBoardFilters } from './useBoardFilters';
import type { Label } from '../types';

export const useFilteredTasks = (columnId: string) => {
  const store = useBoardStore();
  const filters = useBoardFilters();

  const column = store.columns[columnId];
  if (!column) return [];

  return column.taskIds.filter((taskId) => {
    const task = store.tasks[taskId];
    if (!task) return false;

    // 1. Search Query Match
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(query);
      const matchDesc = task.description?.toLowerCase().includes(query) ?? false;
      if (!matchTitle && !matchDesc) return false;
    }

    // 2. Assignee Ids Match (OR logic)
    if (filters.filterAssigneeIds.length > 0) {
      const hasAssignee = task.assigneeIds.some((id) => filters.filterAssigneeIds.includes(id));
      if (!hasAssignee) return false;
    }

    // 3. Labels Match (OR logic)
    if (filters.filterLabels.length > 0) {
      if (!filters.filterLabels.includes(task.label as Label)) return false;
    }

    // 4. Due Date Range Match
    if (filters.filterDueDateRange.from || filters.filterDueDateRange.to) {
      if (!task.dueDate) return false;
      
      const due = new Date(task.dueDate).getTime();
      if (filters.filterDueDateRange.from) {
        const fromDate = new Date(filters.filterDueDateRange.from);
        fromDate.setHours(0, 0, 0, 0);
        if (due < fromDate.getTime()) return false;
      }
      if (filters.filterDueDateRange.to) {
        const toDate = new Date(filters.filterDueDateRange.to);
        toDate.setHours(23, 59, 59, 999);
        if (due > toDate.getTime()) return false;
      }
    }

    return true;
  });
};
