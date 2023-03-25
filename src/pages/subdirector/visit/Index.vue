<script setup lang="ts">
import { searchData } from '@/composables/search';
import { Header, Item } from 'vue3-easy-data-table';

const router = useRouter();
const route = useRoute();

const routeName = computed(() => {
	return String(route.name).split('.')[0];
});

const create = () => {
	setLoading(true);
	router.replace('subdirector/visit').finally(() => {
		setLoading(false);
	});
};

// onBeforeMount(async () => {
// 	await subdirectorVisitServices.getAll().then((response) => {
// 		items.value = response?.data.items
// 	});
// });

const headers: Header[] = [
	{ text: 'No', value: 'id' },
	{ text: 'Fecha', value: 'date_visit' },
	{ text: 'Municipio', value: 'municipality' },
	{ text: 'Monitor', value: 'monitor_name' },
	{ text: 'Escenario Deportivo', value: 'sport_scene' },
	{ text: 'Estado', value: 'status' },
	{ text: 'Acciones', value: 'actions' },
];

// const items = ref<Item[]>([]);
const search = ref('');
const items = ref<Item[]>([
	{
		id: '1',
		date_visit: '2023-02-15',
		municipality: 'Jamundi',
		monitor_name: 'Oscar Martinez',
		sport_scene: 'Cancha Marcella',
		status: {
			id: 2,
			name: 'En Revisión',
			slug: 'ENR',
		},
	},
	{
		id: '2',
		date_visit: '2023-02-20',
		municipality: 'Jamundi',
		monitor_name: 'Oscar Martinez',
		sport_scene: 'Cancha Marcella',
		status: {
			id: 2,
			name: 'En Revisión',
			slug: 'ENR',
		},
	},
	{
		id: '3',
		date_visit: '2023-02-27',
		municipality: 'Jamundi',
		monitor_name: 'Oscar Martinez',
		sport_scene: 'Cancha Marcella',
		status: {
			id: 2,
			name: 'Rechazado',
			slug: 'REC',
		},
	},
]);

const data = computed(() => searchData(items.value, search.value));

// const dataSearch = computed<Item[]>(() => {
// 	if (items.value) {
// 		const searchValue = search.value.toLowerCase();
// 		return items.value.filter(
// 			(item) =>
// 				item.date.includes(searchValue) ||
// 				item.municipality.toLowerCase().includes(searchValue) ||
// 				item.monitor_name.toLowerCase().includes(searchValue) ||
// 				item.sport_scene.toLowerCase().includes(searchValue) ||
// 				item.status.name.toLowerCase().includes(searchValue)
// 		);
// 	}
// 	return items.value;
// });
</script>

<template>
	<div class="flex items-center mt-8 intro-y">
		<h2 class="mr-auto text-lg font-medium">Listado Visitas Subdirector</h2>
		<div class="w-full sm:w-auto flex mt-4 sm:mt-0">
			<Button
				variant="primary"
				class="btn btn-primary"
				@click="create">
				Crear Visita
			</Button>
		</div>
	</div>

	<!-- BEGIN: Page Layout -->
	<div class="p-5 mt-5 intro-y box">
		<!-- <FormInput
			v-model="search"
			placeholder="Buscar"
			class="input w-full h-9 border rounded-none border-b-2 border-x-0 border-t-0 shadow-none pl-1 outline-none focus:outline-none focus:shadow-none focus:border-transparent focus:border-primary-500 mb-2"
			icon="search" /> -->
		<CommonInput
			type="search"
			name="search"
			v-model="search"
			placeholder="Buscar" />
		<Crud
			:headers="headers"
			:items="data" />
		<!-- <DataTable
			:headers="headers"
			:items="items"
			buttons-pagination
			table-class-name="customize-table">
		</DataTable> -->
	</div>
	<!-- END: Page Layout -->
</template>
