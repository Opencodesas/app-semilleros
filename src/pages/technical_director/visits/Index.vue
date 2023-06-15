<script setup lang="ts">
import { searchData } from '@/composables/search';
import { onboardingStore } from '@/stores/onboardingStore';
import { Header, Item } from 'vue3-easy-data-table';

const items = ref<Item[]>([]);

onBeforeMount(async () => {
	await subdirectorVisitServices.getAll().then((response) => {
		items.value = response?.data.items
	});
});

const headers: Header[] = [
	{ text: 'Fecha', value: 'date_visit' },
	{ text: 'Municipio', value: 'municipality.name' },
	{ text: 'Monitor', value: 'monitor.name' },
	{ text: 'Escenario Deportivo', value: 'sport_scene' },
	{ text: 'Estado', value: 'status' },
	{ text: 'Acciones', value: 'actions' },
];

const search = ref('');
const data = computed(() => searchData(items.value, search.value));
</script>

<template>
	<div class="flex items-center mt-8 intro-y">
		<h2 class="mr-auto text-lg font-medium">Listado Visitas Director Técnico</h2>
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
			:items="data" />
	</div>
	<!-- END: Page Layout -->
</template>
