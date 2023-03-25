<script setup lang="ts">
import Crud from '@/components/Crud.vue';
import { searchData } from '@/composables/search';
import { Header, Item } from 'vue3-easy-data-table';

const router = useRouter();
const { find } = useApiV1();

// const { state: methodologist, isLoading, error, execute } = useAsyncState(async () => {
//     return await find<{ items: Item[] }>('methodologist_visit').then((response) => {
//         console.log(response.data.items)
//         return response.data.items
//     })
// }, null)

// onBeforeMount(async () => {
//     await methodologistVisitServices.getAll().then((response) => {
//         console.log(response?.data);
//         items.value = response?.data.items
//     })
// })

const create = () => {
	setLoading(true);
					router
						.push({
							name: 'psychosocial.transversal-activity.create',
						})
						.finally(() => {
							setLoading(false);
						});
};

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
			id: 2,
			name: 'Aprobado',
			slug: 'APR',
		},
		actions: 'actions',
	},
]);

const dataSearch = computed(() => searchData(items.value, search.value));

// const dataSearch = computed<Item[]>(() => {
// 	if (items.value) {
// 		const searchValue = search.value.toLowerCase();
// 		return items.value.filter(
// 			(item) =>
// 				item?.date_visit.includes(searchValue) ||
// 				item?.municipality.toLowerCase().includes(searchValue) ||
// 				item?.coordinator_name.toLowerCase().includes(searchValue) ||
// 				item?.sport_scene.toLowerCase().includes(searchValue) ||
// 				item?.evaluation.toLowerCase().includes(searchValue) ||
// 				item?.status.name.toLowerCase().includes(searchValue) ||
// 				item?.methodologist_name.toLowerCase().includes(searchValue) ||
// 				item?.monitor_name.toLowerCase().includes(searchValue)
// 		);
// 	}
// 	return items.value;
// });
</script>

<template>
	<div class="flex items-center mt-8 intro-y">
		<h2 class="mr-auto text-lg font-medium">Listado Visitas Coordinador</h2>
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
		<CommonInput
			type="search"
			name="search"
			v-model="search"
			placeholder="Buscar" />
		<Crud
			:headers="headers"
			:items="dataSearch" />
	</div>
	<!-- END: Page Layout -->
</template>
