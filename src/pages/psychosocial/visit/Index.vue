<script setup lang="ts">
import { Header, Item } from 'vue3-easy-data-table';
import { searchData } from '@/composables/search';
import { visitServices } from '@/services/psychosocial/visitServices';

//Traer visitas

onBeforeMount(async () => {
	await visitServices.getAll().then((response) => {
		visits.value = response?.data.items
		console.log(response?.data.items)
	})
})

const headerVisits: Header[] = [
	{ text: 'No.', value: 'id', sortable: true },
	{ text: 'Fecha', value: 'date', sortable: true },
	{ text: 'Monitor', value: 'monitor' },
	{ text: 'Municipio', value: 'municipality', sortable: true },
	{ text: 'Escenario Deportivo', value: 'sport_arena' },
	{ text: 'Estado', value: 'status' },
	{ text: 'Acciones', value: 'actions' },
];
// const items = ref<Item[]>([
// 	{
// 		id: '1',
// 		date: '2023-02-11',
// 		monitor: 'Juan',
// 		municipality: 'Cartago',
// 		sport_arena: 'Estadio Nacional',
// 		status: { id: 1, name: 'Aprobado', slug: 'APR' },
// 	},
// 	{
// 		id: '2',
// 		date: '2023-02-11',
// 		monitor: 'Pedro',
// 		municipality: 'Cartago',
// 		sport_arena: 'Estadio Nacional',
// 		status: { id: 2, name: 'En Revisión', slug: 'ENR' },
// 	},
// 	{
// 		id: '3',
// 		date: '2023-02-11',
// 		monitor: 'Juan',
// 		municipality: 'Cartago',
// 		sport_arena: 'Estadio Nacional',
// 		status: { id: 1, name: 'Aprobado', slug: 'APR' },
// 	},
// 	{
// 		id: '4',
// 		date: '2023-02-11',
// 		monitor: 'Maria',
// 		municipality: 'Cartago',
// 		sport_arena: 'Estadio Nacional',
// 		status: { id: 4, name: 'Rechazado', slug: 'REC' },
// 	},
// 	{
// 		id: '5',
// 		date: '2023-02-11',
// 		monitor: 'Jose',
// 		municipality: 'Cartago',
// 		sport_arena: 'Estadio Nacional',
// 		status: { id: 1, name: 'Aprobado', slug: 'APR' },
// 	},
// ]);

//Cambiar items por visits
const visits = ref<Item[]>([]);
const searchVisits = ref('');
const dataSearchVisits = computed(() => searchData(visits.value, searchVisits.value));

</script>

<template>
	<div class="p-5 mt-5 intro-y box">
		<CommonInput type="search" name="search" v-model="searchVisits" placeholder="Buscar" />
		<Crud :headers="headerVisits" :items="dataSearchVisits" />
	</div>
</template>
