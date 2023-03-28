<script setup lang="ts">
import { searchData } from '@/composables/search';
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

// onBeforeMount(async () => {
// 	await subdirectorVisitServices.getAll(id = store.user.id).then((response) => {
// 		items.value = response?.data.items
// 	});
// });
const deleteModule = async (id: string | number) => {
	console.log(id);
	// await subdirectorVisitServices.delete(id).then((response) => {
	// 	console.log(response);
	// });
};

const headers: Header[] = [
	{ text: 'No', value: 'id' },
	{ text: 'Fecha', value: 'date_visit' },
	{ text: 'Municipio', value: 'municipality' },
	{ text: 'Monitor', value: 'monitor_name' },
	{ text: 'Escenario Deportivo', value: 'sport_scene' },
	{ text: 'Estado', value: 'status' },
	{ text: 'Acciones', value: 'actions' },
];

// const items = ref<Item[]>([]);
const search = ref('');
const items = ref<Item[]>([
	{
		id: '1',
		date_visit: '2023-02-15',
		municipality: 'Jamundi',
		monitor_name: 'Oscar Martinez',
		sport_scene: 'Cancha Marcella',
		status: {
			id: 2,
			name: 'En Revisión',
			slug: 'ENR',
		},
	},
	{
		id: '2',
		date_visit: '2023-02-20',
		municipality: 'Jamundi',
		monitor_name: 'Oscar Martinez',
		sport_scene: 'Cancha Marcella',
		status: {
			id: 2,
			name: 'En Revisión',
			slug: 'ENR',
		},
	},
	{
		id: '3',
		date_visit: '2023-02-27',
		municipality: 'Jamundi',
		monitor_name: 'Oscar Martinez',
		sport_scene: 'Cancha Marcella',
		status: {
			id: 2,
			name: 'Rechazado',
			slug: 'REC',
		},
	},
]);

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
			:items="data"
			:onDeleteFnc="deleteModule" />
	</div>
	<!-- END: Page Layout -->
</template>
