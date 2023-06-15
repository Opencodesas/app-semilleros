<script setup lang="ts">
import { Header, Item } from 'vue3-easy-data-table';
import { searchData } from '@/composables/search';
import { visitServices } from '@/services/psychosocial/visitServices';

onBeforeMount(async () => {
	await visitServices.getAll().then((response) => {
		visits.value = response?.data.items
	})
})

const headerVisits: Header[] = [
	{ text: 'Fecha', value: 'date_visit', sortable: true },
	{ text: 'Monitor', value: 'monitor.name' },
	{ text: 'Municipio', value: 'municipality.name' },
	{ text: 'Escenario Deportivo', value: 'scenery' },
	{ text: 'Estado', value: 'status' },
	{ text: 'Acciones', value: 'actions' },
];

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
