<script setup lang="ts">
import Crud from '@/components/Crud.vue';
import { searchData } from '@/composables/search';
import { Header, Item } from 'vue3-easy-data-table';

const items = ref<Item[]>([]);

onMounted(async () => {
	await coordinatorVisitServices.getAll().then((response) => {
		items.value = response?.data.items;
	});
});

const headers: Header[] = [
	//{ text: 'ID', value: 'id' },
	{ text: 'FECHA VISITA', value: 'date_visit' },
	{ text: 'HORA VISITA', value: 'hour_visit' },
	{ text: 'MUNICIPIO', value: 'municipalitie.name' },
	{ text: 'ESCENARIO DEPORTIVO', value: 'sports_scene' },
	{ text: 'Estado', value: 'status' },
	// { text: "ROLES", value: "roles" },
	{ text: 'ACCIONES', value: 'actions' },
];
const search = ref('');
const data = computed(() => searchData(items.value, search.value));
</script>

<template>
	<div class="flex items-center mt-8 intro-y">
		<h2 class="mr-auto text-lg font-medium">
			Listado Visitas de coordinadores
		</h2>
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
			label="Visitas"
			:items="data" />
	</div>
	<!-- END: Page Layout -->
</template>
