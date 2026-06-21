import React from "react";
import {IonCard, IonIcon, IonProgressBar, IonText} from "@ionic/react";
import {checkboxOutline, linkSharp, timerOutline} from "ionicons/icons";
import {format} from "date-fns";
import type {Task, Label, Member} from "../../types";
import {useBoardStore} from "../../store/boardStore";
import {LabelBadge} from "../task/LabelBadge";
import {AvatarGroup} from "../common/Avatar";

import {Draggable} from "@hello-pangea/dnd";

interface TaskCardProps {
	task: Task;
	index: number;
	onTaskOpen: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({task, index, onTaskOpen}) => {
	const members = useBoardStore((state) => state.members);
	const taskMembers = task.assigneeIds.map((id) => members.find((m) => m.id === id)).filter(Boolean) as Member[];

	const completedChecklist = task.checklist.filter((c) => c.isDone).length;
	const totalChecklist = task.checklist.length;
	const progress = totalChecklist > 0 ? completedChecklist / totalChecklist : 0;

	const getProgressBarColor = (l: Label) => {
		switch (l) {
			case "Feature":
				return "primary";
			case "Bug":
				return "danger";
			case "Issue":
				return "warning";
			case "Undefined":
			default:
				return "medium";
		}
	};

	const highlightedTaskId = useBoardStore((state) => state.highlightedTaskId);
	const themeMode = useBoardStore((state) => state.themeMode);
	const isHighlighted = highlightedTaskId === task.id;

	return (
		<Draggable draggableId={task.id} index={index}>
			{(provided, snapshot) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					style={{
						...provided.draggableProps.style,
						opacity: snapshot.isDragging ? 0.8 : 1,
						paddingBottom: "16px",
						zIndex: isHighlighted ? 10 : 1,
					}}
				>
					<IonCard
						id={`task-card-${task.id}`}
						className='task-card-animate task-card-hover'
						onClick={() => onTaskOpen(task.id)}
						style={{
							margin: 0,
							borderRadius: "12px",
							boxShadow: snapshot.isDragging ? "0 8px 16px rgba(0,0,0,0.12)" : "0 2px 8px rgba(0,0,0,0.06)",
							position: "relative",
							overflow: "hidden",
							backgroundColor: themeMode === "light" ? "#ecf2fbff" : "var(--ion-background-color, #1e1e1e)",
							display: "flex",
							flexDirection: "column",
							cursor: "grab",
							transition: "all 0.3s ease",
						}}
					>
						{/* Cover Image */}
						{task.coverImageUrl && (
							<div style={{height: "120px", width: "100%", flexShrink: 0}}>
								<img src={task.coverImageUrl} alt='Cover' style={{width: "100%", height: "100%", objectFit: "cover"}} />
							</div>
						)}

						{/* Main Content Area */}
						<div style={{padding: "16px", flexGrow: 1, display: "flex", flexDirection: "column"}}>
							{/* Label Badge */}
							<div style={{marginBottom: "12px", display: "flex"}}>
								<LabelBadge label={task.label} />
							</div>

							{/* Title */}
							<IonText>
								<h3
									style={{
										margin: "0 0 8px 0",
										fontSize: "14px",
										fontWeight: "600",
										display: "-webkit-box",
										WebkitLineClamp: 2,
										WebkitBoxOrient: "vertical",
										overflow: "hidden",
										lineHeight: "1.4",
										textAlign: "left",
									}}
								>
									{task.title}
								</h3>
							</IonText>

							{/* Description */}
							{task.description && (
								<IonText color='medium'>
									<p
										style={{
											margin: "0 0 16px 0",
											fontSize: "12px",
											display: "-webkit-box",
											WebkitLineClamp: 2,
											WebkitBoxOrient: "vertical",
											overflow: "hidden",
											lineHeight: "1.4",
											textAlign: "left",
										}}
									>
										{task.description}
									</p>
								</IonText>
							)}

							{/* Progress Bar for Checklist */}
							{totalChecklist > 0 && (
								<div style={{marginBottom: "16px", marginTop: "auto"}}>
									<IonProgressBar value={progress} color={getProgressBarColor(task.label)} style={{height: "4px", borderRadius: "2px"}} />
								</div>
							)}

							{/* Footer */}
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									marginTop: totalChecklist > 0 ? "0" : "auto",
								}}
							>
								{/* Left: Meta info */}
								<div
									style={{
										display: "flex",
										alignItems: "center",
										gap: "12px",
										color: "var(--ion-color-medium, #92949c)",
										fontSize: "12px",
										fontWeight: "500",
										flexWrap: "wrap",
									}}
								>
									{task.dueDate && (
										<div style={{display: "flex", alignItems: "center", gap: "4px", color: "var(--ion-color-primary, #2797ffff)", backgroundColor: "rgba(55, 161, 255, 0.1)", padding: "2px 4px", borderRadius: "12px"}}>
											<IonIcon icon={timerOutline} style={{fontSize: "14px"}} />
											<span>{format(new Date(task.dueDate), "d MMM")}</span>
										</div>
									)}

									{totalChecklist > 0 && (
										<div style={{display: "flex", alignItems: "center", gap: "4px"}}>
											<IonIcon icon={checkboxOutline} style={{fontSize: "14px"}} />
											<span>
												{completedChecklist}/{totalChecklist}
											</span>
										</div>
									)}

									{task.attachments.length > 0 && (
										<div style={{display: "flex", alignItems: "center", gap: "4px"}}>
											<IonIcon icon={linkSharp} style={{fontSize: "14px"}} />
											<span>{task.attachments.length}</span>
										</div>
									)}
								</div>

								{/* Right: Assignees */}
								{taskMembers.length > 0 && (
									<div style={{flexShrink: 0}}>
										<AvatarGroup members={taskMembers} size='sm' max={3} />
									</div>
								)}
							</div>
						</div>
					</IonCard>
				</div>
			)}
		</Draggable>
	);
};
