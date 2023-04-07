<script setup lang="ts">
import { onboardingStore } from '@/stores/onboardingStore';
import { Header, Item } from 'vue3-easy-data-table';

const store = onboardingStore();

const router = useRouter();

const create = () => {
	setLoading(true);
	router.push({ name: 'subdirector_visit.create' }).finally(() => {
		setLoading(false);
	});
};
const items = ref<Item[]>([]);

// onBeforeMount(async () => {
// 	subdirectorVisitServices.then((response) => {
// 		items.value = response?.data.items;
// 		console.log(response?.data.items);
// 		return items;
// 	});
// });
const headers: Header[] = [
	{ text: 'No', value: 'id' },
	{ text: 'Fecha', value: 'date_visit' },
	{ text: 'Municipio', value: 'municipality.name' },
	{ text: 'Monitor', value: 'monitor.name' },
	{ text: 'Escenario Deportivo', value: 'sport_scene' },
	{ text: 'Estado', value: 'status' },
	{ text: 'Acciones', value: 'actions' },
];

onBeforeMount(async () => {
	const res = await subdirectorVisitServices.getAll();
	items.value = await res?.data.items;
});

// const items = ref<Item[]>([]);
const search = ref('');

const data = computed(() => searchData(items.value, search.value));
</script>

<template>
	<div class="flex items-center mt-8 intro-y">
		<h2 class="mr-auto text-lg font-medium">Listado Visitas Subdirector</h2>
		<div class="w-full sm:w-auto flex mt-4 sm:mt-0">
			<Button
				variant="primary"
				class="btn btn-primary"
				@click="create">
				Crear Visita
			</Button>
		</div>
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
