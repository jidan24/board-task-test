import React, {useState} from "react";
import {IonPage, IonHeader, IonToolbar, IonContent, IonIcon} from "@ionic/react";
import {downloadOutline, moonOutline, sunnyOutline, lockClosedOutline, chevronDownOutline, personAddOutline} from "ionicons/icons";
import {DragDropContext, Droppable} from "@hello-pangea/dnd";
import type {DropResult} from "@hello-pangea/dnd";
import {useBoardStore} from "../store/boardStore";
import {BoardColumn} from "../components/board/BoardColumn";
import {AddColumnButton} from "../components/board/AddColumnButton";
import {FilterBar} from "../components/filter/FilterBar";
import {SearchBar} from "../components/filter/SearchBar";
import {TaskDetailModal} from "../components/task/TaskDetailModal";
import {AvatarGroup} from "../components/common/Avatar";
import {dummyMembers} from "../data/dummyMembers";

const BoardPage: React.FC = () => {
	const columnsRecord = useBoardStore((state) => state.columns);
	const themeMode = useBoardStore((state) => state.themeMode);
	const toggleThemeMode = useBoardStore((state) => state.toggleThemeMode);
	const [modalState, setModalState] = useState<{isOpen: boolean; taskId?: string; columnId?: string}>({isOpen: false});

	const handleTaskCreate = (columnId: string) => setModalState({isOpen: true, columnId});
	const handleTaskOpen = (taskId: string) => setModalState({isOpen: true, taskId});

	// Sort columns by their order property
	const columns = Object.values(columnsRecord).sort((a, b) => a.order - b.order);

	const handleDragEnd = (result: DropResult) => {
		const store = useBoardStore.getState();
		const {destination, source, draggableId, type} = result;

		if (!destination) return;
		if (destination.droppableId === source.droppableId && destination.index === source.index) return;

		if (type === "column") {
			store.moveColumn(draggableId, destination.index);
			return;
		}

		store.moveTask(draggableId, source.droppableId, destination.droppableId, destination.index);
	};

	return (
		<IonPage>
			<IonHeader className='ion-no-border'>
				<IonToolbar style={{"--background": "var(--ion-background-color, #ffffff)", "--border-width": "0 0 1px 0", "--border-color": "rgba(128, 128, 128, 0.2)", minHeight: "64px", padding: "8px 0"}}>
					<div className='board-header-container'>
						{/* Left Section */}
						<div className='board-header-left'>
							{/* Title Dropdown */}
							<div style={{display: "flex", alignItems: "center", gap: "8px", cursor: "pointer"}}>
								<IonIcon icon={lockClosedOutline} style={{color: "var(--ion-color-medium)", fontSize: "18px"}} />
								<span style={{fontSize: "18px", fontWeight: "bold", color: "var(--ion-text-color)"}}>willBoard</span>
								<IonIcon icon={chevronDownOutline} style={{color: "var(--ion-color-medium)"}} />
							</div>

							{/* Avatars */}
							<div style={{display: "flex", alignItems: "center", gap: "16px"}}>
								<AvatarGroup members={dummyMembers} max={4} size='md' />
							</div>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									gap: "8px",
									backgroundColor: "var(--ion-color-light, #f4f5f8)",
									color: "var(--ion-text-color)",
									borderRadius: "8px",
									padding: "0 12px",
									height: "32px",
									cursor: "pointer",
									fontSize: "14px",
									fontWeight: "bold",
								}}
							>
								<IonIcon icon={personAddOutline} style={{"--ionicon-stroke-width": "48px"} as React.CSSProperties} />
								<span className='ion-hide-md-down'>Invite</span>
							</div>
						</div>

						{/* Right Section */}
						<div className='board-header-right'>
							<div
								onClick={toggleThemeMode}
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									width: "36px",
									height: "36px",
									borderRadius: "8px",
									color: "var(--ion-text-color)",
									cursor: "pointer",
								}}
							>
								<IonIcon icon={themeMode === "light" ? moonOutline : sunnyOutline} style={{fontSize: "20px"}} />
							</div>

							<FilterBar />

							<div
								style={{
									display: "flex",
									alignItems: "center",
									gap: "8px",
									cursor: "pointer",
									height: "36px",
									padding: "0 12px",
									borderRadius: "8px",
									color: "var(--ion-text-color)",
								}}
							>
								<IonIcon icon={downloadOutline} />
								<span className='ion-hide-md-down' style={{fontSize: "14px", fontWeight: "900"}}>
									Export / Import
								</span>
							</div>

							<SearchBar />
						</div>
					</div>
				</IonToolbar>
			</IonHeader>{" "}
			<IonContent scrollY={false} style={{"--background": "var(--ion-background-color, #ffffff)"}}>
				<DragDropContext onDragEnd={handleDragEnd}>
					<Droppable droppableId='board' type='column' direction='horizontal'>
						{(provided) => (
							<div
								ref={provided.innerRef}
								{...provided.droppableProps}
								style={{
									display: "flex",
									height: "100%",
									padding: "24px",
									overflowX: "auto",
									alignItems: "flex-start",
									scrollbarWidth: "thin",
								}}
							>
								{columns.map((col, index) => (
									<BoardColumn key={col.id} column={col} index={index} onTaskCreate={handleTaskCreate} onTaskOpen={handleTaskOpen} />
								))}
								{provided.placeholder}
								<AddColumnButton />
							</div>
						)}
					</Droppable>
				</DragDropContext>
			</IonContent>
			<TaskDetailModal isOpen={modalState.isOpen} taskId={modalState.taskId} initialColumnId={modalState.columnId} onClose={() => setModalState({isOpen: false})} />
		</IonPage>
	);
};

export default BoardPage;
