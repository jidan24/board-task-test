import React, {useState} from "react";
import {IonIcon, IonPopover, IonList, IonItem, IonInput, useIonAlert, useIonToast} from "@ionic/react";
import {ellipsisVertical, addOutline, trashOutline, pencilOutline} from "ionicons/icons";
import {useBoardStore} from "../../store/boardStore";
import {Droppable, Draggable} from "@hello-pangea/dnd";
import {TaskCard} from "./TaskCard";
import {EmptyState} from "../common/EmptyState";
import type {Column} from "../../types";

interface BoardColumnProps {
	column: Column;
	index: number;
	onTaskCreate: (columnId: string) => void;
	onTaskOpen: (taskId: string) => void;
}

export const BoardColumn: React.FC<BoardColumnProps> = ({column, index, onTaskCreate, onTaskOpen}) => {
	const store = useBoardStore();
	const taskIds = store.getFilteredTaskIdsForColumn(column.id);
	const tasks = store.tasks;

	const [showPopover, setShowPopover] = useState(false);
	const [popoverEvent, setPopoverEvent] = useState<Event | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [editTitle, setEditTitle] = useState(column.title);

	const [presentAlert] = useIonAlert();
	const [presentToast] = useIonToast();

	const handleDelete = () => {
		setShowPopover(false);
		presentAlert({
			header: "Delete Column",
			message: "Are you sure you want to delete this column? All tasks inside will be deleted as well.",
			buttons: [
				{text: "Cancel", role: "cancel"},
				{
					text: "Delete",
					role: "destructive",
					handler: () => {
						store.deleteColumn(column.id);
						presentToast({message: "Column deleted", duration: 2000, color: "medium"});
					},
				},
			],
		});
	};

	const handleAddTask = () => {
		onTaskCreate(column.id);
	};

	const submitEdit = () => {
		if (editTitle.trim()) {
			store.updateColumn(column.id, editTitle.trim());
		} else {
			setEditTitle(column.title); // revert if empty
		}
		setIsEditing(false);
	};

	return (
		<Draggable draggableId={column.id} index={index}>
			{(provided) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					style={{
						...provided.draggableProps.style,
						width: "300px",
						minWidth: "280px",
						maxWidth: "85vw",
						backgroundColor: "transparent",
						display: "flex",
						flexDirection: "column",
						maxHeight: "100%",
						marginRight: "16px",
						flexShrink: 0,
					}}
				>
					{/* Header */}
					<div {...provided.dragHandleProps} style={{display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px 16px 0", marginBottom: "8px"}}>
						<div style={{display: "flex", alignItems: "center", gap: "8px"}}>
							{isEditing ? (
								<IonInput value={editTitle} onIonChange={(e) => setEditTitle(e.detail.value!)} onIonBlur={submitEdit} onKeyDown={(e) => e.key === "Enter" && submitEdit()} autoFocus style={{fontWeight: "bold", color: "var(--ion-text-color)", width: "auto"}} />
							) : (
								<h2 onClick={() => setIsEditing(true)} style={{margin: 0, fontSize: "18px", fontWeight: "bold", cursor: "pointer", color: "var(--ion-text-color)"}}>
									{column.title}
								</h2>
							)}

							{/* Add Task Button (Light Blue Pill) */}
							<div
								onClick={handleAddTask}
								style={{
									backgroundColor: "rgba(82, 96, 255, 0.15)", // light tertiary
									color: "var(--ion-color-tertiary, #5260ff)",
									borderRadius: "6px",
									width: "24px",
									height: "24px",
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									cursor: "pointer",
								}}
							>
								<IonIcon icon={addOutline} style={{fontSize: "16px"}} />
							</div>

							{/* Options Button */}
							<div
								onClick={(e) => {
									e.persist();
									setPopoverEvent(e.nativeEvent);
									setShowPopover(true);
								}}
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									cursor: "pointer",
									color: "var(--ion-color-medium)",
								}}
							>
								<IonIcon icon={ellipsisVertical} style={{fontSize: "18px"}} />
							</div>
						</div>
					</div>

					<IonPopover
						isOpen={showPopover}
						event={popoverEvent || undefined}
						onDidDismiss={() => {
							setShowPopover(false);
							setPopoverEvent(null);
						}}
						style={{"--width": "180px", "--border-radius": "12px"}}
					>
						<IonList lines='none' style={{padding: "4px 0"}}>
							<IonItem
								button
								detail={false}
								onClick={() => {
									setIsEditing(true);
									setShowPopover(false);
								}}
								style={{"--min-height": "40px"}}
							>
								<IonIcon icon={pencilOutline} slot='start' style={{fontSize: "18px", color: "var(--ion-color-medium)"}} />
								<span style={{fontSize: "14px", fontWeight: "500", color: "var(--ion-text-color)"}}>Rename list</span>
							</IonItem>
							<IonItem button detail={false} onClick={handleDelete} style={{"--min-height": "40px"}}>
								<IonIcon icon={trashOutline} slot='start' style={{fontSize: "18px", color: "var(--ion-color-danger)"}} />
								<span style={{fontSize: "14px", fontWeight: "500", color: "var(--ion-color-danger)"}}>Delete list</span>
							</IonItem>
						</IonList>
					</IonPopover>

					{/* Body: Scrollable Task List */}
					<Droppable droppableId={column.id}>
						{(provided, snapshot) => (
							<div
								ref={provided.innerRef}
								{...provided.droppableProps}
								style={{
									padding: "0 16px 0 0",
									overflowY: "auto",
									flexGrow: 1,
									scrollbarWidth: "none",
									msOverflowStyle: "none",
									backgroundColor: snapshot.isDraggingOver ? "var(--ion-color-step-50)" : "transparent",
									transition: "background-color 0.2s ease",
									minHeight: "100px",
									borderRadius: "12px",
								}}
							>
								{taskIds.length === 0 ? (
									<EmptyState message='No tasks yet' />
								) : (
									taskIds.map((id, index) => {
										const task = tasks[id];
										return task ? <TaskCard key={task.id} task={task} index={index} onTaskOpen={onTaskOpen} /> : null;
									})
								)}
								{provided.placeholder}
							</div>
						)}
					</Droppable>

					{/* Footer */}
					<div style={{padding: "8px 16px 8px 0", marginTop: "auto"}}>
						<button
							onClick={handleAddTask}
							style={{
								width: "100%",
								padding: "12px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								gap: "8px",
								backgroundColor: "rgba(0,0,0,0.03)",
								border: "none",
								borderRadius: "8px",
								color: "var(--ion-color-medium)",
								fontSize: "15px",
								cursor: "pointer",
								transition: "background-color 0.2s",
							}}
							onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.06)")}
							onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.03)")}
						>
							<IonIcon icon={addOutline} style={{fontSize: "18px"}} />
							Add a card
						</button>
					</div>
				</div>
			)}
		</Draggable>
	);
};
