<script setup lang="ts">
import Crud from '@/components/Crud.vue';
import { searchData } from '@/composables/search';
import { Header, Item } from 'vue3-easy-data-table';
import Form from './Form.vue';

const search = ref('');

const headers: Header[] = [
	//{ text: 'Nro.', value: 'id' },
	{ text: 'Fecha', value: 'date_visit', sortable: true },
	{ text: 'Municipio', value: 'municipalities.name', sortable: true  },
	{ text: 'Metodologo', value: 'creator.name', sortable: true },
	{ text: 'Escenario Deportivo', value: 'sports_scene', sortable: true },
	{ text: 'Evaluacion', value: 'evaluations.label', sortable: true },
	{ text: 'Estado', value: 'status' },
	{ text: 'Acciones', value: 'actions' },
];

const items = ref<Item[]>([]);

onMounted(async () => {
	const res = await methodologistVisitServices.getAll()
	items.value = await res?.data.items
	for (let i = 0; i < items.value.length; i++) {
		items.value[i].evaluations = await items.value[i].evaluations.id == '1' ? { label: 'Aprobado', id: 1 } : { label: 'Rechazado', id: 2 };
	}
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
