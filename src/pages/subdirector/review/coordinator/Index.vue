<script setup lang="ts">
import Crud from '@/components/Crud.vue';
import { searchData } from '@/composables/search';
import { onboardingStore } from '@/stores/onboardingStore';
import { Header, Item } from 'vue3-easy-data-table';
import Form from './Form.vue';

const store = onboardingStore();

const router = useRouter();
const { find } = useApiV1();

// const { state: methodologist, isLoading, error, execute } = useAsyncState(async () => {
//     return await find<{ items: Item[] }>('methodologist_visit').then((response) => {
//         console.log(response.data.items)
//         return response.data.items
//     })
// }, null)

// onMounted(async () => {
// 	setLoading(true);
// 	await coordinatorVisitServices
// 		.getAll()
// 		.then((response) => {
// 			console.log(response?.data);
// 			items.value = response?.data.items;
// 			setLoading(false);
// 		}).catch((error) => {
// 			console.log(error);
// 			setLoading(false);
// 			Alerts.error('Error al cargar los datos');
// 		});
// });

const search = ref('');

const headers: Header[] = [
	{ text: 'Nro.', value: 'id' },
	{ text: 'Fecha', value: 'date_visit' },
	{ text: 'Municipio', value: 'municipality' },
	{ text: 'Coordinador', value: 'coordinator_name' },
	{ text: 'Escenario Deportivo', value: 'sport_scene' },
	{ text: 'Estado', value: 'status' },
	{ text: 'Acciones', value: 'actions' },
];

const items = ref<Item[]>([
	{
		id: '1',
		date_visit: '2021-05-01',
		municipality: 'Palmira',
		coordinator_name: 'Pepito',
		sport_scene: 'Cancha',
		status: {
			id: 2,
			name: 'En Revisión',
			slug: 'ENR',
		},
		actions: 'actions',
	},
	{
		id: '2',
		date_visit: '2021-05-01',
		municipality: 'Palmira',
		coordinator_name: 'Pepito',
		sport_scene: 'Cancha',
		status: {
			id: 1,
			name: 'Aprobado',
			slug: 'APR',
		},
		actions: 'actions',
	},
]);

const dataSearch = computed(() => searchData(items.value, search.value));
</script>

<template>
	<!-- BEGIN: Page Layout -->
	<div class="p-5 mt-5 intro-y box">
		<CommonInput
			type="search"
			name="search"
			v-model="search"
			placeholder="Buscar" />
		<Crud
			:Form="Form"
			:headers="headers"
			:items="dataSearch" />
	</div>
	<!-- END: Page Layout -->
</template>
