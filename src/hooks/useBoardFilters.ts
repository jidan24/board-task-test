import { useQueryState, parseAsArrayOf, parseAsString, parseAsJson } from 'nuqs';
import type { Label } from '../types';

export const useBoardFilters = () => {
  const [searchQuery, setSearchQuery] = useQueryState('q', parseAsString.withDefault(''));
  const [filterAssigneeIds, setFilterAssigneeIds] = useQueryState('assignees', parseAsArrayOf(parseAsString).withDefault([]));
  const [filterLabels, setFilterLabels] = useQueryState('labels', parseAsArrayOf(parseAsString).withDefault([]));
  const [filterDueDateRange, setFilterDueDateRange] = useQueryState(
    'due', 
    parseAsJson<{from: string | null; to: string | null}>((val) => val as {from: string | null; to: string | null}).withDefault({from: null, to: null})
  );

  const clearFilters = () => {
    setSearchQuery(null);
    setFilterAssigneeIds(null);
    setFilterLabels(null);
    setFilterDueDateRange(null);
  };

  return {
    searchQuery, setSearchQuery,
    filterAssigneeIds, setFilterAssigneeIds,
    filterLabels: filterLabels as Label[], setFilterLabels,
    filterDueDateRange, setFilterDueDateRange,
    clearFilters,
  };
};
