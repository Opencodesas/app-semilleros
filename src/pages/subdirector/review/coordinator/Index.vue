<script setup lang="ts">
import Crud from '@/components/Crud.vue';
import { searchData } from '@/composables/search';
import { Header, Item } from 'vue3-easy-data-table';
import Form from './Form.vue';

onMounted(async () => {
	setLoading(true);
	await coordinatorVisitServices
		.getAll()
		.then((response) => {
			console.log(response?.data.items);
			items.value = response?.data.items;
			setLoading(false);
		})
		.catch((error) => {
			setLoading(false);
			alerts.error('Error al cargar los datos');
		});
});

const search = ref('');

const headers: Header[] = [
	{ text: 'Nro.', value: 'id' },
	{ text: 'Fecha', value: 'date_visit' },
	{ text: 'Municipio', value: 'municipalitie.name' },
	// { text: 'Coordinador', value: 'created_by.name' },
	{ text: 'Escenario Deportivo', value: 'sports_scene' },
	{ text: 'Estado', value: 'status' },
	{ text: 'Acciones', value: 'actions' },
];

const items = ref<Item[]>([]);

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
