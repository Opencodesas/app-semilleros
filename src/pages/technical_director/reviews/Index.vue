<script setup lang="ts">
import { Header, Item } from 'vue3-easy-data-table';
import subdirectoVisitReview from './subdirectorVisitReview.vue';
//import { subdirectorVisitServices } from '@/services/subdirectorVisitServices';

const { multiple } = useFilepondEvents();

// const routeName = computed(() => {
//     return String(route.name).split('.')[0]
// })


const header: Header[] = [
	{ text: 'No.', value: 'id', sortable: true },
	{ text: 'Fecha', value: 'date_visit', sortable: true },
	{ text: 'Subdirector', value: 'created_by.name' },
	{ text: 'Municipio', value: 'municipality.name', sortable: true },
	{ text: 'Escenario Deportivo', value: 'sport_scene' },
	{ text: 'Estado', value: 'status' },
	{ text: 'Acciones', value: 'actions' },
];

const items = ref<Item[]>([]);
onMounted(async () => {
	await subdirectorVisitServices.getAll().then((response) => {
		items.value = response?.data.items;
	});
});

//Filter
const search = ref('');
const dataSearch = computed(() => searchData(items.value, search.value));
</script>

<template>
	<div class="p-5 mt-5 intro-y box">
        <h3 class="mb-2 text-lg">Subdirector</h3>
		<CommonInput
			type="search"
			name="search"
			v-model="search"
			placeholder="Buscar" />
		<Crud
			:headers="header"
			:items="dataSearch"
			:Form="subdirectoVisitReview" />
	</div>
</template>
