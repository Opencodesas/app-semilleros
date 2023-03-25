<script setup lang="ts">
import useVuelidate_visit from '@vuelidate_visit/core'
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
//     await subdirectorVisitServices.getAll().then((response) => {
//          items.value = response?.data.items
//      })
// })
const items = ref<Item[]>([
    { id: '1', date_visit: '2023-02-11', monitor: 'Juan', municipality: 'Cartago', sport_arena: 'Estadio Nacional', status: { id: 1, name: 'Aprobado', slug: 'APR' } },
    { id: '2', date_visit: '2022-02-11', monitor: 'Pedro', municipality: 'Cartago', sport_arena: 'Estadio Nacional', status: { id: 2, name: 'En Revisión', slug: 'ENR' } },
    { id: '3', date_visit: '2023-02-11', monitor: 'Juan', municipality: 'Cartago', sport_arena: 'Estadio Nacional', status: { id: 1, name: 'Aprobado', slug: 'APR' } },
    { id: '4', date_visit: '2023-02-11', monitor: 'Maria', municipality: 'Cartago', sport_arena: 'Estadio Nacional', status: { id: 4, name: 'Rechazado', slug: 'REC' } },
    { id: '5', date_visit: '2023-02-11', monitor: 'Jose', municipality: 'Cartago', sport_arena: 'Estadio Nacional', status: { id: 1, name: 'Aprobado', slug: 'APR' } },
])


const header: Header[] = [
    { text: 'No.', value: 'id', sortable: true },
    { text: 'Fecha', value: 'date_visit', sortable: true },
    { text: 'Municipio', value: 'municipality', sortable: true },
    { text: 'Monitor', value: 'monitor' },
    { text: 'Escenario Deportivo', value: 'sport_arena' },
    { text: 'Estado', value: 'status' },
    { text: 'Acciones', value: 'actions' },
]

onMounted(() => {
    console.log(console.log(items))
})

const search = ref('');
const dataSearch = computed(() => searchData(items.value, search.value));

</script>

<template>
    <div class="mb-5 mt-10">
        <CommonInput type="search" name="search" v-model="search" placeholder="Buscar" />
    </div>
    <div class="">
        <Crud :headers="header" :items="dataSearch" />
    </div>
</template>