<script setup lang="ts">
import { Header, Item } from 'vue3-easy-data-table';
import { technicalSubdirectorVisitServices } from '@/services/technical_subdirector/technicalSubdirectorVisitServices';
import useVuelidate from '@vuelidate/core'
import { required } from '@/utils/validators'



const { multiple } = useFilepondEvents();


// const routeName = computed(() => {
//     return String(route.name).split('.')[0]
// })




onMounted(() => {
    console.log(console.log(items))
})


const header: Header[] = [
    { text: 'No.', value: 'id', sortable: true },
    { text: 'Fecha', value: 'date_visit', sortable: true },
    { text: 'Subdirector', value: 'monitor' },
    { text: 'Municipio', value: 'municipality', sortable: true },
    { text: 'Escenario Deportivo', value: 'sport_arena' },
    { text: 'Estado', value: 'status' },
    { text: 'Acciones', value: 'actions' },
]

//Traer visitas personalizadas en revisión

// const items = ref<Item[]>([])

// onBeforeMount(async () => {
//     await subdirectorVisitServices.getAll().then((response) => {
//         items.value = response?.data.items
//     })
// })

const items = ref<Item[]>([
    { id: '1', date_visit: '2023-03-11', monitor: 'Juan', municipality: 'Cartago', sport_arena: 'Estadio Nacional', status: { id: 2, name: 'En Revisión', slug: 'ENR' } },
    { id: '2', date_visit: '2023-04-11', monitor: 'Pedro', municipality: 'Cartago', sport_arena: 'Estadio Nacional', status: { id: 2, name: 'En Revisión', slug: 'ENR' } },
    { id: '3', date_visit: '2023-02-11', monitor: 'Juan', municipality: 'Cartago', sport_arena: 'Estadio Nacional', status: { id: 2, name: 'En Revisión', slug: 'ENR' } },
    { id: '4', date_visit: '2023-02-11', monitor: 'Maria', municipality: 'Cartago', sport_arena: 'Estadio Nacional', status: { id: 2, name: 'En Revisión', slug: 'ENR' } },
    { id: '5', date_visit: '2023-02-11', monitor: 'Jose', municipality: 'Cartago', sport_arena: 'Estadio Nacional', status: { id: 2, name: 'En Revisión', slug: 'ENR' } },
])

//Filter
const search = ref('');
const dataSearch = computed(() => searchData(items.value, search.value));

</script>

<template>
    <div class="m-5">
        <CommonInput type="search" name="search" v-model="search" placeholder="Buscar" />
    </div>
    <div class="" >
        <Crud :headers="header" :items="dataSearch" />
    </div>
</template>