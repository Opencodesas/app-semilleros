<script setup lang="ts">
import Crud from '@/components/Crud.vue';
import { searchData } from '@/composables/search';
import { Header, Item } from 'vue3-easy-data-table';

const items = ref<Item[]>([]);

onMounted(async () => {
	await coordinatorVisitServices.getAll().then((response) => {
		items.value = response?.data.items;
	});
});

const headers: Header[] = [
	//{ text: 'ID', value: 'id' },
	{ text: 'Fecha', value: 'date_visit', sortable: true },
	{ text: 'Municipio', value: 'municipalitie.name', sortable: true },
	{ text: 'Coordinador', value: 'created_by.name', sortable: true },
	{ text: 'Escenario Deportivo', value: 'sports_scene', sortable: true },
	{ text: 'Estado', value: 'status' },
	{ text: 'Acciones', value: 'actions' },
];
const search = ref('');
const data = computed(() => searchData(items.value, search.value));

const downloadAllMeto = async()=>{
	await coordinatorVisitServices.downloadFilesMeto().then((response)=>{
				if (response) {
					if (response.status >= 200 && response.status <= 300) {
						console.log(response);
						//setLoading(true);
						/*router.push({ name: 'coordinator.index' }).finally(() => {
							setLoading(false);
						});*/
					}
				} else {
					console.log("error");
				}
	}).catch((error)=>{console.log(error)})
}
const downloadAllCoor = async()=>{
	await coordinatorVisitServices.downloadFilesCoor().then((response)=>{
				if (response) {
					if (response.status >= 200 && response.status <= 300) {
						console.log(response);
						//setLoading(true);
						/*router.push({ name: 'coordinator.index' }).finally(() => {
							setLoading(false);
						});*/
					}
				} else {
					console.log("error");
				}
	}).catch((error)=>{console.log(error)})
}
const downloadAll = async()=>{
	await coordinatorVisitServices.downloadFiles().then((response)=>{
				if (response) {
					if (response.status >= 200 && response.status <= 300) {
						console.log(response);
						//setLoading(true);
						/*router.push({ name: 'coordinator.index' }).finally(() => {
							setLoading(false);
						});*/
					}
				} else {
					console.log("error");
				}
	}).catch((error)=>{console.log(error)})
}
</script>

<template>
	<div class="flex items-center mt-8 intro-y">
		<h2 class="mr-auto text-lg font-medium">
			Listado Visitas de coordinadores
		</h2>
		<!-- <Button
			variant="primary"
			class="btn btn-primary"
			@click="downloadAllMeto">
			Descargar Meto
		</Button>
		<Button
			variant="primary"
			class="btn btn-primary"
			@click="downloadAllCoor">
			Descargar Coor
		</Button>
		<Button
			variant="primary"
			class="btn btn-primary"
			@click="downloadAll">
			Descargar Zips
		</Button> -->
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
			label="Visitas"
			:items="data" />
	</div>
	<!-- END: Page Layout -->
</template>
