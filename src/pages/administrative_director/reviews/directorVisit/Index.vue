<script setup lang="ts">
import { Header, Item } from 'vue3-easy-data-table';
import { searchData } from '@/composables/search';
import visitReview from './VisitReview.vue'
import { onboardingStore } from '@/stores/onboardingStore';

//Traer visitas del director tecnico en revisión


const items = ref<Item[]>([]);

onBeforeMount(async () => {

	await subdirectorVisitServices.getAll().then((response) => {
		items.value = response?.data.items;
		console.log(items.value)
	});
});

const headers: Header[] = [
    { text: 'No', value: 'id' },
    { text: 'Fecha', value: 'date_visit' },
    { text: 'Director', value: 'created_by.name' },
    { text: 'Municipio', value: 'municipality.name' },
    { text: 'Escenario Deportivo', value: 'sport_scene' },
    { text: 'Estado', value: 'status' },
    { text: 'Acciones', value: 'actions' },
];


const search = ref('');
const dataSearch = computed(() => searchData(items.value, search.value));

</script>

<template>
    <div class="flex items-center justify-between mt-5 mb-2 intro-y">
        <h1 class="mr-auto text-lg font-medium">Revisar visitas de los directores tecnicos</h1>
    </div>
    <div class="p-5 mt-5 intro-y space-y-2 box">
        <CommonInput type="search" name="search" v-model="search" placeholder="Buscar" />
        <Crud :headers="headers" :items="items" :Form="visitReview" />
    </div>
</template>
