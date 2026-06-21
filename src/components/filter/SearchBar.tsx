import React, {useState, useEffect} from "react";
import {IonSearchbar} from "@ionic/react";
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
		<IonSearchbar
			className='search-bar-responsive custom-searchbar'
			value={localQuery}
			onIonInput={(e) => setLocalQuery(e.detail.value!)}
			placeholder='Search Tasks'
			style={{
				width: "400px",
				height: "28px",
				minHeight: "28px",
				padding: 0,
				"--background": "var(--ion-color-light, #f4f5f8)",
				"--border-radius": "8px",
				"--box-shadow": "none",
				"--icon-color": "var(--ion-color-medium)",
			}}
		/>
	);
};
