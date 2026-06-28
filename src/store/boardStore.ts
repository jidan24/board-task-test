import {create} from "zustand";
import {persist} from "zustand/middleware";
import type {BoardState, Task, ChecklistItem, Attachment} from "../types";
import {seedBoardState} from "../data/seedData";
import {useToastStore} from "./toastStore";

interface BoardStoreState extends BoardState {
	themeMode: "light" | "dark";
	highlightedTaskId: string | null;

	// Actions
	setHighlightedTaskId: (id: string | null) => void;
	addColumn: (title: string) => void;
	updateColumn: (columnId: string, title: string) => void;
	deleteColumn: (columnId: string) => void;

	addTask: (columnId: string, taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "columnId">) => string;
	updateTask: (taskId: string, partialTaskData: Partial<Task>) => void;
	deleteTask: (taskId: string) => void;
	moveTask: (taskId: string, sourceColumnId: string, destColumnId: string, destIndex: number) => void;
	moveColumn: (columnId: string, destIndex: number) => void;

	toggleChecklistItem: (taskId: string, checklistItemId: string) => void;
	addChecklistItem: (taskId: string, text: string) => void;
	deleteChecklistItem: (taskId: string, checklistItemId: string) => void;

	addAttachment: (taskId: string, fileName: string, fileType: string) => void;
	deleteAttachment: (taskId: string, attachmentId: string) => void;

	toggleThemeMode: () => void;
}

// Helper to generate random IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

export const useBoardStore = create<BoardStoreState>()(
	persist(
		(set) => ({
			...seedBoardState,
			themeMode: "light",
			highlightedTaskId: null,

			setHighlightedTaskId: (id) => set({highlightedTaskId: id}),

			addColumn: (title) => {
				set((state) => {
					const id = `col-${generateId()}`;
					const order = Object.values(state.columns).length + 1;
					return {
						columns: {
							...state.columns,
							[id]: {id, title, order, taskIds: []},
						},
					};
				});
				useToastStore.getState().showToast("Column added", "success");
			},

			updateColumn: (columnId, title) => {
				set((state) => ({
					columns: {
						...state.columns,
						[columnId]: {...state.columns[columnId], title},
					},
				}));
			},

			deleteColumn: (columnId) => {
				set((state) => {
					const newColumns = {...state.columns};
					const taskIdsToRemove = newColumns[columnId]?.taskIds || [];
					delete newColumns[columnId];

					const newTasks = {...state.tasks};
					taskIdsToRemove.forEach((taskId) => {
						delete newTasks[taskId];
					});

					return {columns: newColumns, tasks: newTasks};
				});
				useToastStore.getState().showToast("Column deleted", "danger");
			},

			addTask: (columnId, taskData) => {
				const id = `task-${generateId()}`;
				set((state) => {
					const now = new Date().toISOString();
					const newTask: Task = {
						...taskData,
						id,
						columnId,
						createdAt: now,
						updatedAt: now,
					};

					const newColumn = {
						...state.columns[columnId],
						taskIds: [...state.columns[columnId].taskIds, id],
					};

					return {
						tasks: {...state.tasks, [id]: newTask},
						columns: {...state.columns, [columnId]: newColumn},
					};
				});
				useToastStore.getState().showToast("Task added", "success");
				return id;
			},

			updateTask: (taskId, partialTaskData) => {
				set((state) => {
					const task = state.tasks[taskId];
					if (!task) return state;

					return {
						tasks: {
							...state.tasks,
							[taskId]: {
								...task,
								...partialTaskData,
								updatedAt: new Date().toISOString(),
							},
						},
					};
				});
				useToastStore.getState().showToast("Task updated", "success");
			},

			deleteTask: (taskId) => {
				set((state) => {
					const task = state.tasks[taskId];
					if (!task) return state;

					const newTasks = {...state.tasks};
					delete newTasks[taskId];

					const columnId = task.columnId;
					const newColumnTaskIds = state.columns[columnId].taskIds.filter((id) => id !== taskId);

					return {
						tasks: newTasks,
						columns: {
							...state.columns,
							[columnId]: {
								...state.columns[columnId],
								taskIds: newColumnTaskIds,
							},
						},
					};
				});
				useToastStore.getState().showToast("Task deleted", "danger");
			},

			moveTask: (taskId, sourceColumnId, destColumnId, destIndex) => {
				set((state) => {
					const sourceColumn = state.columns[sourceColumnId];
					const destColumn = state.columns[destColumnId];

					if (!sourceColumn || !destColumn) return state;

					const newSourceTaskIds = [...sourceColumn.taskIds];
					const sourceIndex = newSourceTaskIds.indexOf(taskId);
					if (sourceIndex > -1) {
						newSourceTaskIds.splice(sourceIndex, 1);
					}

					const newDestTaskIds = sourceColumnId === destColumnId ? newSourceTaskIds : [...destColumn.taskIds];
					newDestTaskIds.splice(destIndex, 0, taskId);

					const newColumns = {
						...state.columns,
						[sourceColumnId]: {...sourceColumn, taskIds: newSourceTaskIds},
						[destColumnId]: {...destColumn, taskIds: newDestTaskIds},
					};

					const newTasks = {
						...state.tasks,
						[taskId]: {
							...state.tasks[taskId],
							columnId: destColumnId,
							updatedAt: new Date().toISOString(),
						},
					};

					return {columns: newColumns, tasks: newTasks};
				});
			},

			moveColumn: (columnId, destIndex) => {
				set((state) => {
					const sortedColumns = Object.values(state.columns).sort((a, b) => a.order - b.order);
					const sourceIndex = sortedColumns.findIndex((c) => c.id === columnId);
					if (sourceIndex === -1 || sourceIndex === destIndex) return state;

					const newColumns = [...sortedColumns];
					const [movedColumn] = newColumns.splice(sourceIndex, 1);
					newColumns.splice(destIndex, 0, movedColumn);

					const updatedColumnsMap = {...state.columns};
					newColumns.forEach((col, index) => {
						updatedColumnsMap[col.id] = {...col, order: index};
					});

					return {columns: updatedColumnsMap};
				});
			},

			toggleChecklistItem: (taskId, checklistItemId) => {
				set((state) => {
					const task = state.tasks[taskId];
					if (!task) return state;

					const newChecklist = task.checklist.map((item) => (item.id === checklistItemId ? {...item, isDone: !item.isDone} : item));

					return {
						tasks: {
							...state.tasks,
							[taskId]: {...task, checklist: newChecklist, updatedAt: new Date().toISOString()},
						},
					};
				});
			},

			addChecklistItem: (taskId, text) => {
				set((state) => {
					const task = state.tasks[taskId];
					if (!task) return state;

					const newItem: ChecklistItem = {id: `chk-${generateId()}`, text, isDone: false};

					return {
						tasks: {
							...state.tasks,
							[taskId]: {...task, checklist: [...task.checklist, newItem], updatedAt: new Date().toISOString()},
						},
					};
				});
			},

			deleteChecklistItem: (taskId, checklistItemId) => {
				set((state) => {
					const task = state.tasks[taskId];
					if (!task) return state;

					return {
						tasks: {
							...state.tasks,
							[taskId]: {
								...task,
								checklist: task.checklist.filter((item) => item.id !== checklistItemId),
								updatedAt: new Date().toISOString(),
							},
						},
					};
				});
			},

			addAttachment: (taskId, fileName, fileType) => {
				set((state) => {
					const task = state.tasks[taskId];
					if (!task) return state;

					const newAttachment: Attachment = {id: `att-${generateId()}`, fileName, fileType};

					return {
						tasks: {
							...state.tasks,
							[taskId]: {...task, attachments: [...task.attachments, newAttachment], updatedAt: new Date().toISOString()},
						},
					};
				});
			},

			deleteAttachment: (taskId, attachmentId) => {
				set((state) => {
					const task = state.tasks[taskId];
					if (!task) return state;

					return {
						tasks: {
							...state.tasks,
							[taskId]: {
								...task,
								attachments: task.attachments.filter((item) => item.id !== attachmentId),
								updatedAt: new Date().toISOString(),
							},
						},
					};
				});
			},

			toggleThemeMode: () => set((state) => ({themeMode: state.themeMode === "light" ? "dark" : "light"})),
		}),
		{
			name: "adhivasindo-task-board",
		}
	)
);
