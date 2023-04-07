<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { required } from '@/utils/validators'
import { Header, Item } from 'vue3-easy-data-table';
import { customVisitServices } from '@/services/psychosocial/customVisitServices';


const { multiple } = useFilepondEvents();

const router = useRouter()
const route = useRoute()


const routeName = computed(() => {
    return String(route.name).split('.')[0]
})

// const items = ref<Item[]>([])

// onBeforeMount(async () => {
//     await userServices.getAll().then((response) => {
//         items.value = response?.data.items
//     })
// })

const items = ref<Item[]>([
    {id: '1', date: '2023-02-11', monitor: 'Juan', municipality: 'Cartago', sport_arena: 'Estadio Nacional', status: {id: 1, name: 'Aprobado', slug: 'APR'}},
    {id: '2', date: '2023-02-11', monitor: 'Pedro', municipality: 'Cartago', sport_arena: 'Estadio Nacional', status: {id: 2, name: 'En Revisión', slug: 'ENR'}},
    {id: '3', date: '2023-02-11', monitor: 'Juan', municipality: 'Cartago', sport_arena: 'Estadio Nacional', status: {id: 1, name: 'Aprobado', slug: 'APR'}},
    {id: '4', date: '2023-02-11', monitor: 'Maria', municipality: 'Cartago', sport_arena: 'Estadio Nacional', status: {id: 4, name: 'Rechazado', slug: 'REC'}},
    {id: '5', date: '2023-02-11', monitor: 'Jose', municipality: 'Cartago', sport_arena: 'Estadio Nacional', status: {id: 1, name: 'Aprobado', slug: 'APR'}},
])


const header: Header[] = [
    { text: 'No.', value: 'id', sortable: true },
    { text: 'Fecha', value: 'date', sortable: true },
    { text: 'Municipio', value: 'municipality', sortable: true },
    { text: 'Monitor', value: 'monitor' },
    { text: 'Escenario Deportivo', value: 'sport_arena' },
    { text: 'Estado', value: 'status' },
    { text: 'Acciones', value: 'actions' },
]

onMounted(() => {
    console.log(console.log(items))
})
</script>

<template>
    <div class="m-5">
        <h1>Filtro pendiente</h1>
    </div>
    <div class="" >
        <Crud :headers="header" :items="items" />
    </div>
</template>