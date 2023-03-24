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
    {
        id: '1',
        month: 'Enero',
        municipality: 'Cartago',
        beneficiary: 'Juan',
        status: {
            id: 2,
            name: 'En Revisión',
            slug: 'ENR'
        },
    },
    {
        id: '2',
        month: 'Enero',
        municipality: 'Cartago',
        beneficiary: 'Pedro',
        status: {
            id: 4,
            name: 'Rechazado',
            slug: 'REC'
        },
    },
    {
        id: '3',
        month: 'Enero',
        municipality: 'Cartago',
        beneficiary: 'Juan',
        status: {
            id: 1,
            name: 'Aprobado',
            slug: 'APR'
        },
    },
    {
        id: '4',
        month: 'Enero',
        municipality: 'Cartago',
        beneficiary: 'Maria',
        status: {
            id: 4,
            name: 'Rechazado',
            slug: 'REC'
        },
    },
    {
        id: '5',
        month: 'Enero',
        municipality: 'Cartago',
        beneficiary: 'Jose',
        status:
        {
            id: 1,
            name: 'Aprobado',
            slug: 'APR'
        },
    },
    {
        id: '6',
        month: 'Enero',
        municipality: 'Cartago',
        beneficiary: 'Luis',
        status: {
            id: 4,
            name: 'Rechazado',
            slug: 'REC'
        },
    },
    {
        id: '7',
        month: 'Enero',
        municipality: 'Cartago',
        beneficiary: 'Maria',
        status: {
            id: 4,
            name: 'Rechazado',
            slug: 'REC'
        },
    },
    {
        id: '8',
        month: 'Enero',
        municipality: 'Cartago',
        beneficiary: 'Pedro',
        status: {
            id: 4,
            name: 'Rechazado',
            slug: 'REC'
        },
    },
    {
        id: '9',
        month: 'Enero',
        municipality: 'Cartago',
        beneficiary: 'Juan',
        status: {
            id: 1,
            name: 'Aprobado',
            slug: 'APR'
        },
    },
    {
        id: '10',
        month: 'Enero',
        municipality: 'Cartago',
        beneficiary: 'Luis',
        status: {
            id: 1,
            name: 'Aprobado',
            slug: 'APR'
        },
    },

])

onMounted(() => {
    console.log(console.log(items))
})


const header: Header[] = [
    { text: 'No.', value: 'id', sortable: true },
    { text: 'Fecha', value: 'date', sortable: true },
    { text: 'Municipio', value: 'municipality', sortable: true },
    { text: 'Monitor', value: 'monitor' },
    { text: 'Escenario Deportivo', value: 'sport_arena' },
    { text: 'Estado', value: 'status' },
    { text: 'Acciones', value: 'actions' },
]


</script>

<template>
    <div class="m-5">
        <h1>Filtro pendiente</h1>
    </div>
    <div class="" >
        <Crud :headers="header" :items="items" />
    </div>
</template>