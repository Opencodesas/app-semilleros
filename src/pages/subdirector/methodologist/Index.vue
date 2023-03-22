<script setup lang="ts">
import Crud from '@/components/Crud.vue';
import RequestHandleError from '@/components/RequestHandleError.vue';
import RequestHandleLoading from '@/components/RequestHandleLoading.vue';
import { Header, Item } from 'vue3-easy-data-table';

const router = useRouter()
const { find } = useApiV1()

// const { state: methodologist, isLoading, error, execute } = useAsyncState(async () => {
//     return await find<{ items: Item[] }>('methodologist_visit').then((response) => {
//         console.log(response.data.items)
//         return response.data.items
//     })
// }, null)

// onBeforeMount(async () => {
//     await methodologistVisitServices.getAll().then((response) => {
//         console.log(response?.data);
//         items.value = response?.data.items
//     })
// })



const headers: Header[] = [
    { text: 'Nro.', value: 'id' },
    { text: 'Fecha', value: 'date_visit' },
    { text: 'Municipio', value: 'municipality' },
    { text: 'Metodologo', value: 'name' },
    { text: 'Escenario Deportivo', value: 'sport_facility' },
    { text: 'Evaluacion', value: 'evaluation' },
    { text: 'Estado', value: 'status' },
    { text: 'Acciones', value: 'actions' },
]

const items = ref<Item[]>([
    {
		id: "1",
		date_visit: "2021-05-01",
        municipality: "Palmira",
        name: "Pepito",
        sport_facility: "Cancha",
        evaluation: "Aprobada",
        status: {
			id: 2,
			name: 'En Revisión',
			slug: 'ENR',
		},
    },
    {
        id: "2",
        date_visit: "2021-05-01",
        municipality: "Palmira",
        name: "Pepito",
        sport_facility: "Cancha",
        evaluation: "Aprobada",
        status: {
			id: 2,
			name: 'Aprobado',
			slug: 'APR',
		},
        actions: "actions",
    },

])

</script>

<template>
    <div class="flex items-center mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">
            Visitas metodologos
        </h2>
        
    </div>
    <!-- BEGIN: Page Layout -->
    <div class="p-5 mt-5 intro-y box">
        <FormInput
			placeholder="Buscar"
			class="input w-full h-9 border rounded-none border-b-2 border-x-0 border-t-0 shadow-none pl-1 outline-none focus:outline-none focus:shadow-none focus:border-transparent focus:border-primary-500 mb-2"
			icon="search" />
            <Crud :headers="headers" :items="items" />
    </div>
    <!-- END: Page Layout -->
</template>
