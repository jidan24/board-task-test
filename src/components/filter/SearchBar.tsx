import React, {useState, useEffect} from "react";
import {IonIcon} from "@ionic/react";
import {searchOutline} from "ionicons/icons";
import {useBoardStore} from "../../store/boardStore";

export const SearchBar: React.FC = () => {
	const storeSearchQuery = useBoardStore((state) => state.searchQuery);
	const setSearchQuery = useBoardStore((state) => state.setSearchQuery);

	const [localQuery, setLocalQuery] = useState(storeSearchQuery);

	useEffect(() => {
		const handler = setTimeout(() => {
			setSearchQuery(localQuery);
		}, 300); // 300ms debounce
		return () => clearTimeout(handler);
	}, [localQuery, setSearchQuery]);

	return (
		<div
			className='search-bar-responsive'
			style={{
				display: "flex",
				alignItems: "center",
				backgroundColor: "var(--ion-color-light, #f4f5f8)",
				borderRadius: "8px",
				padding: "0 12px",
				height: "32px",
				width: "250px",
				gap: "8px",
			}}
		>
			<IonIcon icon={searchOutline} style={{color: "var(--ion-color-medium)", fontSize: "16px"}} />
			<input
				type='text'
				value={localQuery}
				onChange={(e) => setLocalQuery(e.target.value)}
				placeholder='Search Tasks'
				style={{
					border: "none",
					background: "transparent",
					outline: "none",
					width: "100%",
					color: "var(--ion-text-color)",
					fontSize: "14px",
					textAlign: "left",
				}}
			/>
		</div>
	);
};
