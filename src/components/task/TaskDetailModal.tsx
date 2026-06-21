import React, {useState} from "react";
import {IonModal, IonContent, IonButton, IonIcon, IonInput, IonSelect, IonSelectOption, IonDatetime, IonPopover, useIonToast, useIonAlert, IonGrid, IonRow, IonCol, createAnimation} from "@ionic/react";
import {closeOutline, checkmarkOutline, imageOutline, pencilOutline, calendarOutline, chevronDownOutline} from "ionicons/icons";
import {format} from "date-fns";
import {useBoardStore} from "../../store/boardStore";
import type {Task} from "../../types";
import {AssigneeSelector} from "./AssigneeSelector";
import {PrioritySelector} from "./PrioritySelector";
import {ChecklistSection} from "./ChecklistSection";
import {AttachmentSection} from "./AttachmentSection";
import {dummyImages} from "../../data/dummyImages";

interface TaskDetailModalProps {
	isOpen: boolean;
	taskId?: string;
	initialColumnId?: string;
	onClose: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({isOpen, taskId, initialColumnId, onClose}) => {
	const store = useBoardStore();
	const [presentToast] = useIonToast();
	const [presentAlert] = useIonAlert();

	const [draft, setDraft] = useState<Partial<Task>>({});
	const [isDirty, setIsDirty] = useState(false);
	const [showDatePicker, setShowDatePicker] = useState(false);

	const isEditMode = !!taskId;

	const [prevIsOpen, setPrevIsOpen] = useState(false);
	const [prevTaskId, setPrevTaskId] = useState<string | undefined>(undefined);

	if (isOpen !== prevIsOpen || taskId !== prevTaskId) {
		setPrevIsOpen(isOpen);
		setPrevTaskId(taskId);
		if (isOpen) {
			if (isEditMode && taskId) {
				const task = store.tasks[taskId];
				if (task) {
					setDraft({...task});
				}
			} else {
				setDraft({
					title: "",
					description: "",
					assigneeIds: [],
					dueDate: null,
					label: "Undefined",
					columnId: initialColumnId || Object.keys(store.columns)[0],
					checklist: [],
					attachments: [],
				});
			}
			setIsDirty(false);
		}
	}

	const updateDraft = <K extends keyof Task>(key: K, value: Task[K]) => {
		setDraft((prev) => ({...prev, [key]: value}));
		setIsDirty(true);
	};

	const handleClose = () => {
		if (isDirty) {
			presentAlert({
				header: "Unsaved Changes",
				message: "Are you sure you want to discard your changes?",
				buttons: [
					{text: "Cancel", role: "cancel"},
					{text: "Save", handler: () => handleSave()},
					{text: "Discard", role: "destructive", handler: () => onClose()},
				],
			});
		} else {
			onClose();
		}
	};

	const handleSave = () => {
		let savedTaskId = taskId;
		if (isEditMode && taskId) {
			store.updateTask(taskId, draft);
			presentToast({message: "Task updated", duration: 2000, color: "success"});
		} else {
			const finalTitle = draft.title?.trim() || "Untitled Task";
			savedTaskId = store.addTask(draft.columnId as string, {...draft, title: finalTitle} as Omit<Task, "id" | "createdAt" | "updatedAt">);
			presentToast({message: "Task created", duration: 2000, color: "success"});
		}

		if (savedTaskId) {
			store.setHighlightedTaskId(savedTaskId);
			setTimeout(() => {
				store.setHighlightedTaskId(null);
			}, 2000);
		}

		setIsDirty(false);
		onClose();
	};

	const handleDelete = () => {
		presentAlert({
			header: "Delete Task",
			message: "Are you sure you want to delete this task?",
			buttons: [
				{text: "Cancel", role: "cancel"},
				{
					text: "Delete",
					role: "destructive",
					handler: () => {
						store.deleteTask(taskId!);
						onClose();
						presentToast({message: "Task deleted", duration: 2000, color: "medium"});
					},
				},
			],
		});
	};

	const handleAddCover = () => {
		if (dummyImages.length > 0) {
			const randomImg = dummyImages[Math.floor(Math.random() * dummyImages.length)];
			updateDraft("coverImageUrl", randomImg);
		}
	};

	const enterAnimation = (baseEl: HTMLElement) => {
		const root = baseEl.shadowRoot;
		const backdropEl = root?.querySelector("ion-backdrop");
		const backdropAnimation = createAnimation();
		if (backdropEl) backdropAnimation.addElement(backdropEl);
		backdropAnimation.fromTo("opacity", "0.01", "var(--backdrop-opacity)");

		const wrapperEl = root?.querySelector(".modal-wrapper");
		const wrapperAnimation = createAnimation();
		if (wrapperEl) wrapperAnimation.addElement(wrapperEl);

		let transformFrom = "scale(0.8) translateY(20px)";
		let opacityFrom = "0";

		if (taskId) {
			const cardEl = document.getElementById(`task-card-${taskId}`);
			if (cardEl) {
				const rect = cardEl.getBoundingClientRect();
				const centerX = window.innerWidth / 2;
				const centerY = window.innerHeight / 2;
				const cardCenterX = rect.left + rect.width / 2;
				const cardCenterY = rect.top + rect.height / 2;

				const translateX = cardCenterX - centerX;
				const translateY = cardCenterY - centerY;

				transformFrom = `translate(${translateX}px, ${translateY}px) scale(0.2)`;
				opacityFrom = "0";
			}
		}

		wrapperAnimation.keyframes([
			{offset: 0, opacity: opacityFrom, transform: transformFrom},
			{offset: 1, opacity: "1", transform: "translate(0, 0) scale(1)"},
		]);

		return createAnimation().addElement(baseEl).easing("cubic-bezier(0.32,0.72,0,1)").duration(300).addAnimation([backdropAnimation, wrapperAnimation]);
	};

	const leaveAnimation = (baseEl: HTMLElement) => {
		return enterAnimation(baseEl).direction("reverse").duration(250);
	};

	return (
		<IonModal isOpen={isOpen} onDidDismiss={handleClose} className='responsive-modal' enterAnimation={enterAnimation} leaveAnimation={leaveAnimation}>
			<IonContent>
				<div style={{padding: "24px 32px"}}>
					{/* Top Actions */}
					<div style={{display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "16px", borderBottom: "1px solid rgba(128, 128, 128, 0.2)"}}>
						<IonButton
							style={{
								"--background": "var(--ion-color-light, #f4f5f8)",
								"--color": "var(--ion-text-color)",
								"--box-shadow": "none",
								textTransform: "none",
								borderRadius: "6px",
								height: "36px",
								margin: 0,
							}}
						>
							<IonIcon icon={checkmarkOutline} slot='start' />
							Mark Complete
						</IonButton>
						<IonButton fill='clear' color='medium' onClick={handleClose} style={{margin: 0, height: "36px", width: "36px"}}>
							<IonIcon icon={closeOutline} />
						</IonButton>
					</div>

					<IonGrid fixed={false} style={{padding: 0, marginTop: "24px"}}>
						<IonRow>
							{/* LEFT COLUMN */}
							<IonCol size='12' sizeMd='6' style={{paddingRight: "24px", borderRight: "1px solid rgba(128, 128, 128, 0.2)"}}>
								{/* Cover Image Area */}
								<div style={{paddingBottom: "24px", borderBottom: "1px solid rgba(128, 128, 128, 0.2)"}}>
									{draft.coverImageUrl ? (
										<div style={{position: "relative", width: "100%", height: "200px", borderRadius: "12px", overflow: "hidden"}}>
											<img src={draft.coverImageUrl} alt='Cover' style={{width: "100%", height: "100%", objectFit: "cover"}} />
											<IonButton fill='solid' color='light' size='small' style={{position: "absolute", top: "8px", right: "8px", opacity: 0.8}} onClick={() => updateDraft("coverImageUrl", undefined)}>
												<IonIcon icon={closeOutline} />
											</IonButton>
										</div>
									) : (
										<div
											onClick={handleAddCover}
											style={{
												width: "100%",
												height: "160px",
												borderRadius: "12px",
												border: "2px dashed rgba(128, 128, 128, 0.2)",
												display: "flex",
												flexDirection: "column",
												alignItems: "center",
												justifyContent: "center",
												color: "var(--ion-color-primary)",
												cursor: "pointer",
												backgroundColor: "transparent",
											}}
										>
											<IonIcon icon={imageOutline} style={{fontSize: "32px", marginBottom: "8px"}} />
											<span style={{fontWeight: "500", fontSize: "14px"}}>Add Cover Image</span>
										</div>
									)}
								</div>

								{/* Title Area */}
								<div style={{display: "flex", alignItems: "center", gap: "12px", padding: "24px 0 16px 0"}}>
									<IonInput value={draft.title} onIonChange={(e) => updateDraft("title", e.detail.value || "")} style={{fontSize: "24px", fontWeight: "bold", "--padding-start": 0, "--padding-end": 0, flex: 1}} placeholder='Task Title' />
									<IonIcon icon={pencilOutline} style={{fontSize: "18px", color: "var(--ion-color-medium)"}} />
								</div>

								{/* Grid for Meta Info */}
								<IonGrid fixed={false} style={{padding: 0}}>
									<IonRow>
										<IonCol size='6' style={{paddingRight: "16px"}}>
											<div style={{color: "var(--ion-text-color)", fontSize: "14px", fontWeight: "600", marginBottom: "12px"}}>Assignee</div>
											<AssigneeSelector value={draft.assigneeIds || []} onChange={(val) => updateDraft("assigneeIds", val)} />
										</IonCol>
										<IonCol size='6' style={{paddingLeft: "16px"}}>
											<div style={{color: "var(--ion-text-color)", fontSize: "14px", fontWeight: "600", marginBottom: "12px"}}>Due Date</div>
											<div
												onClick={() => setShowDatePicker(true)}
												style={{
													padding: "8px 12px",
													backgroundColor: "var(--ion-color-light, #f4f5f8)",
													borderRadius: "8px",
													cursor: "pointer",
													display: "flex",
													alignItems: "center",
													justifyContent: "space-between",
													fontSize: "14px",
												}}
											>
												<span>{draft.dueDate ? format(new Date(draft.dueDate), "d MMM, yyyy") : "Set Date..."}</span>
												<IonIcon icon={calendarOutline} style={{color: "var(--ion-color-medium)"}} />
											</div>
											<IonPopover isOpen={showDatePicker} onDidDismiss={() => setShowDatePicker(false)}>
												<IonDatetime
													presentation='date'
													value={draft.dueDate}
													onIonChange={(e) => {
														updateDraft("dueDate", e.detail.value as string);
														setShowDatePicker(false);
													}}
												/>
											</IonPopover>
										</IonCol>
									</IonRow>

									<IonRow style={{marginTop: "24px"}}>
										<IonCol size='6' style={{paddingRight: "16px"}}>
											<div style={{color: "var(--ion-text-color)", fontSize: "14px", fontWeight: "600", marginBottom: "12px"}}>Board</div>
											<div
												style={{
													height: "36px",
													padding: "0 12px",
													backgroundColor: "var(--ion-color-light, #f4f5f8)",
													borderRadius: "8px",
													fontSize: "14px",
													display: "flex",
													justifyContent: "space-between",
													alignItems: "center",
												}}
											>
												<span>willBoard</span>
												<IonIcon icon={chevronDownOutline} style={{color: "var(--ion-color-medium)"}} />
											</div>
										</IonCol>
										<IonCol size='6' style={{paddingLeft: "16px"}}>
											<div style={{color: "var(--ion-text-color)", fontSize: "14px", fontWeight: "600", marginBottom: "12px"}}>Column</div>
											<IonSelect
												value={draft.columnId}
												onIonChange={(e) => updateDraft("columnId", e.detail.value)}
												interface='popover'
												style={{
													backgroundColor: "var(--ion-color-light, #f4f5f8)",
													borderRadius: "8px",
													margin: 0,
													minHeight: "36px",
													height: "36px",
													fontSize: "14px",
													"--padding-start": "12px",
													"--padding-end": "12px",
													"--padding-top": "0",
													"--padding-bottom": "0",
												}}
											>
												{Object.values(store.columns)
													.sort((a, b) => a.order - b.order)
													.map((col) => (
														<IonSelectOption key={col.id} value={col.id}>
															{col.title}
														</IonSelectOption>
													))}
											</IonSelect>
										</IonCol>
									</IonRow>

									<IonRow style={{marginTop: "24px"}}>
										<IonCol size='6' style={{paddingRight: "16px"}}>
											<div style={{color: "var(--ion-text-color)", fontSize: "14px", fontWeight: "600", marginBottom: "12px"}}>Label</div>
											<IonSelect
												value={draft.label}
												onIonChange={(e) => updateDraft("label", e.detail.value)}
												interface='popover'
												style={{
													backgroundColor: "var(--ion-color-light, #f4f5f8)",
													borderRadius: "8px",
													margin: 0,
													minHeight: "36px",
													height: "36px",
													fontSize: "14px",
													"--padding-start": "12px",
													"--padding-end": "12px",
													"--padding-top": "0",
													"--padding-bottom": "0",
												}}
											>
												<IonSelectOption value='Feature'>Feature</IonSelectOption>
												<IonSelectOption value='Bug'>Bug</IonSelectOption>
												<IonSelectOption value='Issue'>Issue</IonSelectOption>
												<IonSelectOption value='Undefined'>Undefined</IonSelectOption>
											</IonSelect>
										</IonCol>
										<IonCol size='6' style={{paddingLeft: "16px"}}>
											<div style={{color: "var(--ion-text-color)", fontSize: "14px", fontWeight: "600", marginBottom: "12px"}}>Priority</div>
											<PrioritySelector value={draft.priority} onChange={(val) => updateDraft("priority", val)} />
										</IonCol>
									</IonRow>
								</IonGrid>
							</IonCol>

							{/* RIGHT COLUMN */}
							<IonCol size='12' sizeMd='6' style={{paddingLeft: "24px", display: "flex", flexDirection: "column"}}>
								{/* Description */}
								<div style={{paddingBottom: "24px", borderBottom: "1px solid var(--border)"}}>
									<h3 style={{fontSize: "18px", fontWeight: "bold", margin: "0 0 16px 0"}}>Description</h3>
									<div style={{position: "relative"}}>
										<IonIcon icon={pencilOutline} style={{position: "absolute", top: "12px", left: "12px", fontSize: "16px", color: "var(--ion-text-color)", zIndex: 2}} />
										<textarea
											value={draft.description}
											onChange={(e) => updateDraft("description", e.target.value)}
											style={{
												width: "100%",
												backgroundColor: "var(--ion-color-light, #f4f5f8)",
												padding: "10px 12px 10px 36px",
												borderRadius: "8px",
												minHeight: "100px",
												border: "none",
												outline: "none",
												resize: "vertical",
												color: "var(--ion-text-color)",
												fontFamily: "inherit",
												fontSize: "14px",
												textAlign: "left",
												lineHeight: "1.5",
											}}
											placeholder='Add a more detailed description...'
										/>
									</div>
								</div>

								{/* Attachments */}
								<div style={{padding: "24px 0", borderBottom: "1px solid rgba(128, 128, 128, 0.2)"}}>
									<h3 style={{fontSize: "18px", fontWeight: "bold", margin: "0 0 16px 0"}}>Attachments</h3>
									<AttachmentSection attachments={draft.attachments || []} onChange={(newAttachments) => updateDraft("attachments", newAttachments)} />
								</div>

								{/* Check List */}
								<div style={{padding: "24px 0", borderBottom: "1px solid rgba(128, 128, 128, 0.2)"}}>
									<h3 style={{fontSize: "18px", fontWeight: "bold", margin: "0 0 16px 0"}}>Check List</h3>
									<ChecklistSection checklist={draft.checklist || []} onChange={(newChecklist) => updateDraft("checklist", newChecklist)} />
								</div>

								{/* Activity */}
								{isEditMode && (
									<div style={{padding: "24px 0", borderBottom: "1px solid rgba(128, 128, 128, 0.2)"}}>
										<h3 style={{fontSize: "18px", fontWeight: "bold", margin: "0 0 16px 0"}}>Activity</h3>
										<div style={{fontSize: "14px", color: "var(--ion-color-medium)", lineHeight: "1.6"}}>
											<div>Created on: {draft.createdAt ? format(new Date(draft.createdAt), "dd MMM yyyy, HH:mm") : "-"}</div>
											<div>Last updated: {draft.updatedAt ? format(new Date(draft.updatedAt), "dd MMM yyyy, HH:mm") : "-"}</div>
										</div>
									</div>
								)}

								{/* Spacer to push footer to bottom if content is short */}
								<div style={{flex: 1}}></div>

								{/* Footer Actions (In Right Column) */}
								<div style={{display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "24px"}}>
									<div>
										{isEditMode && (
											<IonButton fill='clear' color='danger' onClick={handleDelete} style={{textTransform: "none", margin: 0}}>
												Delete Task
											</IonButton>
										)}
									</div>
									<div style={{display: "flex", gap: "8px"}}>
										<IonButton
											onClick={handleClose}
											style={{
												"--background": "var(--ion-color-light, #f4f5f8)",
												"--color": "var(--ion-text-color)",
												"--box-shadow": "none",
												textTransform: "none",
												borderRadius: "6px",
												margin: 0,
											}}
										>
											Discard
										</IonButton>
										<IonButton
											color='primary'
											onClick={handleSave}
											style={{
												textTransform: "none",
												borderRadius: "6px",
												"--box-shadow": "none",
												margin: 0,
											}}
										>
											Save
										</IonButton>
									</div>
								</div>
							</IonCol>
						</IonRow>
					</IonGrid>
				</div>
			</IonContent>
		</IonModal>
	);
};
