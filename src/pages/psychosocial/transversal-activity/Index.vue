<script setup lang="ts">
import Crud from '@/components/Crud.vue';
import { searchData } from '@/composables/search';
import { Header, Item } from 'vue3-easy-data-table';
import FormActivity from './Form.vue'

const router = useRouter();

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
	{ text: 'Municipio', value: 'municipalities.name' },
	{ text: 'Coordinador', value: 'creator.name' },
	{ text: 'Escenario Deportivo', value: 'scene' },
	{ text: 'Estado', value: 'status' },
	{ text: 'Acciones', value: 'actions' },
];

const items = ref<Item[]>([
	// {
	// 	id: '1',
	// 	date_visit: '2021-05-01',
	// 	municipality: 'Palmira',
	// 	coordinator_name: 'Pepito',
	// 	sport_scene: 'Cancha',
	// 	status: {
	// 		id: 2,
	// 		name: 'En Revisión',
	// 		slug: 'ENR',
	// 	},
	// 	actions: 'actions',
	// },
	// {
	// 	id: '2',
	// 	date_visit: '2021-05-01',
	// 	municipality: 'Palmira',
	// 	coordinator_name: 'Pepito',
	// 	sport_scene: 'Cancha',
	// 	status: {
	// 		id: 2,
	// 		name: 'Aprobado',
	// 		slug: 'APR',
	// 	},
	// 	actions: 'actions',
	// },
	// {
	// 	id: '3',
	// 	date_visit: '2023-02-27',
	// 	municipality: 'Jamundi',
	// 	coordinator_name: 'Oscar Martinez',
	// 	sport_scene: 'Cancha Marcella',
	// 	status: {
	// 		id: 2,
	// 		name: 'Rechazado',
	// 		slug: 'REC',
	// 	},
	// },
]);

const dataSearch = computed(() => searchData(items.value, search.value));

onMounted(async () => {
	await transversalActivityServices.getAll().then((response) => {
		items.value = response?.data.items;

	});
});
</script>

<template>
	<!-- BEGIN: Page Layout -->
	<div class="p-5 intro-y box">
		<CommonInput
			type="search"
			name="search"
			v-model="search"
			placeholder="Buscar" />
		<Crud
			:Form="FormActivity"
			:headers="headers"
			:items="dataSearch" />
	</div>
	<!-- END: Page Layout -->
</template>
