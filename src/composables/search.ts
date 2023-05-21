import { Item } from 'vue3-easy-data-table';


export const searchData = (items: Item[], search: String) => {
	if (items) {
		const searchValue = search.toLowerCase();
		return items.filter(
			(item) =>
				item.date_visit?.includes(searchValue) ||
				item.municipality?.name?.toLowerCase().includes(searchValue) ||
				item.coordinator_name?.toLowerCase().includes(searchValue) ||
				item.sport_scene?.toLowerCase().includes(searchValue) ||
				item.evaluation?.toLowerCase().includes(searchValue) ||
				item.status?.name?.toLowerCase().includes(searchValue) ||
				item.methodologist_name?.toLowerCase().includes(searchValue) ||
				item.monitor_name?.toLowerCase().includes(searchValue) ||

				//Para visita personalizadas psicosocial (se excluyen los que ya estan arriba)
				item.month?.toLowerCase().includes(searchValue) ||
				item.beneficiary?.toLowerCase().includes(searchValue) 		||
			
				//Para actividades transversales
				item.municipalities?.name?.toLowerCase().includes(searchValue) ||
				item.creator?.name?.toLowerCase().includes(searchValue) ||
				item.scene?.toLowerCase().includes(searchValue) ||

				//para fichas de monitores
				item.created_by?.full_name?.toLowerCase().includes(searchValue) ||
			
				//Psra lisra de usuarios
				item.email?.toLowerCase().includes(searchValue) ||
				item.name?.toLowerCase().includes(searchValue) ||
				item.lastname?.toLowerCase().includes(searchValue) ||
				item.document_number?.toLowerCase().includes(searchValue)
		);
	}
	return items
};