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
	{ text: 'No', value: 'id', sortable: true },
	{ text: 'Fecha', value: 'date_visit', sortable: true },
	{ text: 'Municipio', value: 'municipality.name', sortable: true },
	{ text: 'Monitor', value: 'monitor.name', sortable: true },
	{ text: 'Escenario Deportivo', value: 'sport_scene' },
	{ text: 'Estado', value: 'status', sortable: true },
	{ text: 'Acciones', value: 'actions' },
];

onMounted(async () => {
	const res = await subdirectorVisitServices.getAll();
	items.value = await res?.data.items;
	const statues = await getSelectStatus();
	let index = 0;
	console.log(items.value[1].status);
	while (true) {
		if (index == items.value.length) {
			break;
		}
		items.value[index].status = statues[items.value[index].status_id.id - 1];
		index++;
	}
});

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
