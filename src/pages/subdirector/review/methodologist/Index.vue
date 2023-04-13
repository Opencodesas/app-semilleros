<script setup lang="ts">
import Crud from '@/components/Crud.vue';
import { searchData } from '@/composables/search';
import { Header, Item } from 'vue3-easy-data-table';
import Form from './Form.vue'
import { onboardingStore } from "@/stores/onboardingStore";
import Alerts from '@/composables/alerts';

const store = onboardingStore();
console.log(store.user.id);
const router = useRouter();
const { find } = useApiV1();

// const { state: methodologist, isLoading, error, execute } = useAsyncState(async () => {
//     return await find<{ items: Item[] }>('methodologist_visit').then((response) => {
//         console.log(response.data.items)
//         return response.data.items
//     })
// }, null)

// onBeforeMount(async () => {
//     await methodologistVisitServices.getAll(subdirector = store.user.id).then((response) => {
//         console.log(response?.data);
//         items.value = response?.data.items
//     })
// })

const search = ref('');

const headers: Header[] = [
	{ text: 'Nro.', value: 'id' },
	{ text: 'Fecha', value: 'date_visit' },
	{ text: 'Municipio', value: 'municipality' },
	{ text: 'Metodologo', value: 'methodologist_name' },
	{ text: 'Escenario Deportivo', value: 'sport_scene' },
	{ text: 'Evaluacion', value: 'evaluation' },
	{ text: 'Estado', value: 'status' },
	{ text: 'Acciones', value: 'actions' },
];

const items = ref<Item[]>([
	{
		id: '1',
		date_visit: '2021-05-01',
		municipality: 'Palmira',
		methodologist_name: 'Pepito',
		sport_scene: 'Cancha',
		evaluation: 'Aprobada',
		status: {
			id: 2,
			name: 'En Revisión',
			slug: 'ENR',
		},
	},
	{
		id: '2',
		date_visit: '2021-05-01',
		municipality: 'Palmira',
		methodologist_name: 'Pepito',
		sport_scene: 'Cancha',
		evaluation: 'Aprobada',
		status: {
			id: 2,
			name: 'En Revisión',
			slug: 'ENR',
		},
	},
	{
		id: '2',
		date_visit: '2021-05-01',
		municipality: 'Palmira',
		methodologist_name: 'Pepito',
		sport_scene: 'Cancha',
		evaluation: 'Aprobada',
		status: {
			id: 2,
			name: 'Aprobado',
			slug: 'APR',
		},
		actions: 'actions',
	},
]);

// onMounted(async () => {
// 	setLoading(true);
// 	await find<{ items: Item[] }>('methodologist_visit').then((response) => {
// 		console.log(response.data.items);
// 		items.value = response.data.items;
// 		setLoading(false);
// 	}).catch((error) => {
// 		console.log(error);
// 		setLoading(false);
// 		Alerts.error('Error al cargar los datos');
// 	});
// });

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
			:items="dataSearch"/>
	</div>
	<!-- END: Page Layout -->
</template>
