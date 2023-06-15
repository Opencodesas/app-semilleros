<script setup lang="ts">
import Crud from '@/components/Crud.vue'
import { Header, Item } from 'vue3-easy-data-table';

const router = useRouter()


const create = () => {
    setLoading(true)
    router.push({name: 'methodologist_visits.create'}).finally(() => {
        setLoading(false)
    })
}
const items = ref<Item[]>([])
const search = ref('');

onMounted(async () => {
	const res = await methodologistVisitServices.getAll()
	items.value = await res?.data.items
	for (let i = 0; i < items.value.length; i++) {
		items.value[i].evaluations = await items.value[i].evaluations.id == '1' ? 'Aprobado' : 'Rechazado';
	}
});

const headers: Header[] = [
	//{ text: 'Nro.', value: 'id' },
	{ text: 'Fecha', value: 'date_visit', sortable: true },
	{ text: 'Municipio', value: 'municipalities.name', sortable: true },
	{ text: 'Metodologo', value: 'creator.name', sortable: true },
	{ text: 'Escenario Deportivo', value: 'sports_scene', sortable: true },
	{ text: 'Evaluacion', value: 'evaluations', sortable: true },
	{ text: 'Estado', value: 'status' },
	{ text: 'Acciones', value: 'actions'},
];
const dataSearch = computed(() => searchData(items.value, search.value));

</script>

<template>
    <div class="flex items-center mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">Listado Visitas Metodologo</h2>
        <div class="w-full sm:w-auto flex mt-4 sm:mt-0">
            <Button variant="primary" class="btn btn-primary" @click="create">
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
        <Crud :headers="headers" :items="dataSearch" />
    </div>
    <!-- END: Page Layout -->
</template>
