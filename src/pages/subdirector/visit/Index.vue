<script setup lang="ts">
import { Header, Item } from 'vue3-easy-data-table';

const router = useRouter();

const create = () => {
	setLoading(true);
	router.push({ name: 'subdirector_visit.create' }).finally(() => {
		setLoading(false);
	});
};
const items = ref<Item[]>([]);

const headers: Header[] = [
	//{ text: 'No', value: 'id', sortable: true },
	{ text: 'Fecha', value: 'date_visit', sortable: true },
	{ text: 'Municipio', value: 'municipality.name', sortable: true },
	{ text: 'Monitor', value: 'monitor.name', sortable: true },
	{ text: 'Escenario Deportivo', value: 'sport_scene', sortable: true },
	{ text: 'Estado', value: 'status' },
	{ text: 'Acciones', value: 'actions' },
];

onMounted(async () => {
	const res = await subdirectorVisitServices.getAll();
	items.value = await res?.data.items;
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
