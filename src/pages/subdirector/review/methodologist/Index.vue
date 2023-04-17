<script setup lang="ts">
import Crud from '@/components/Crud.vue';
import { searchData } from '@/composables/search';
import { Header, Item } from 'vue3-easy-data-table';
import Form from './Form.vue';

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

const items = ref<Item[]>([]);

onMounted(async () => {
	await methodologistVisitServices
		.getAll()
		.then((response) => {
			items.value = response?.data.items;
		});
});

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
