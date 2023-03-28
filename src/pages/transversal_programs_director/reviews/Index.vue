<script setup lang="ts">
import { Header, Item } from 'vue3-easy-data-table';
import { technicalSubdirectorVisitServices } from '@/services/technical_subdirector/technicalSubdirectorVisitServices';
import transversalActivityReview from './transversalActivityReview.vue'



const { multiple } = useFilepondEvents();


// const routeName = computed(() => {
//     return String(route.name).split('.')[0]
// })




onMounted(() => {
    console.log(console.log(items))
})


const header: Header[] = [
    { text: 'No.', value: 'id', sortable: true },
    { text: 'Usuario', value: 'user.name', sortable: true },
    { text: 'Municipio', value: 'municipality' },
    { text: 'Fecha', value: 'date', sortable: true },
    { text: 'Número de Asistentes', value: 'attenders' },
    { text: 'Estado', value: 'status' },
    { text: 'Acciones', value: 'actions' },
]

//Traer actividades transversales en revisión

// const items = ref<Item[]>([])

// onBeforeMount(async () => {
//     await subdirectorVisitServices.getAll().then((response) => {
//         items.value = response?.data.items
//     })
// })

const items = ref<Item[]>([
    {
        id: '1',
        user: { id: 1, name: 'Juan' },
        municipality: 'Cartago',
        date: '2023-03-11',
        attenders: 10,
        status: { id: 2, name: 'En Revisión', slug: 'ENR' }
    },
    {
        id: '2',
        user: { id: 2, name: 'Pedro' },
        municipality: 'Cartago',
        date: '2023-04-11',
        attenders: 10,
        status: { id: 2, name: 'En Revisión', slug: 'ENR' }
    },
    {
        id: '3',
        user: { id: 3, name: 'Juan' },
        municipality: 'Cartago',
        date: '2023-02-11',
        attenders: 10,
        status: { id: 2, name: 'En Revisión', slug: 'ENR'  }
    },
    {
        id: '4',
        user: { id: 4, name: 'Maria' },
        municipality: 'Cartago',
        date: '2023-02-11',
        attenders: 10,
        status: { id: 2, name: 'En Revisión', slug: 'ENR'  }
    },
    {
        id: '5',
        user: { id: 5, name: 'Jose' },
        municipality: 'Cartago',
        date: '2023-02-11',
        attenders: 10,
        status: { id: 2, name: 'En Revisión', slug: 'ENR'  }
    },

])

//Filter
const search = ref('');
const dataSearch = computed(() => searchData(items.value, search.value));

</script>

<template>
    <div class="m-5"><h1 class="mr-auto text-lg font-medium">Actividades Transversales </h1></div>
    <div class="m-5">
        <CommonInput type="search" name="search" v-model="search" placeholder="Buscar" />
    </div>
    <div class="">
        <Crud :headers="header" :items="dataSearch" :Form="transversalActivityReview"/>
    </div>
</template>