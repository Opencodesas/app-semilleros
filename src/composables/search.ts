import { Item } from 'vue3-easy-data-table';


export const searchData = (items: Item[], search: String) => {
	if (items) {
		const searchValue = search.toLowerCase();
		return items.filter(
			(item) =>
				item.date_visit?.includes(searchValue) ||
				item.municipality?.toLowerCase().includes(searchValue) ||
				item.coordinator_name?.toLowerCase().includes(searchValue) ||
				item.sport_scene?.toLowerCase().includes(searchValue) ||
				item.evaluation?.toLowerCase().includes(searchValue) ||
				item.status.name?.toLowerCase().includes(searchValue) ||
				item.methodologist_name?.toLowerCase().includes(searchValue) ||
				item.monitor_name?.toLowerCase().includes(searchValue)
		);
	}
	return items
};