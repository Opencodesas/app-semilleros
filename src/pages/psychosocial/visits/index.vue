<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { required } from '@/utils/validators'
import { Header, Item } from 'vue3-easy-data-table';
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import { customVisitServices } from '@/services/psychosocial/customVisitServices';
import { onboardingStore } from "@/stores/onboardingStore";

const { multiple } = useFilepondEvents();

const router = useRouter()
const route = useRoute()
const store = onboardingStore();

const routeName = computed(() => {
    return String(route.name).split('.')[0]
})

// const itemsVisit = ref<Item[]>([])

// const itemsCustomVisit = ref<Item[]>([])

// const itemsTransversalActivity = ref<Item[]>([])

// onBeforeMount(async () => {
//     await psychosocialVisitServices.getAll().then((response) => {
//          itemsVisit.value = response?.data.items
//      })
//     await customVisitServices.getAll().then((response) => {
//          itemsCustomVisit.value = response?.data.items
//      })
//     await transversalActivityServices.getAll().then((response) => {
//         itemsTransversalActivity.value = response?.data.items
//     })
// })

onMounted(() => {
    console.log(console.log(items))
});
    

const headerVisits: Header[] = [
    { text: 'No.', value: 'id', sortable: true },
    { text: 'Fecha', value: 'date', sortable: true },
    { text: 'Monitor', value: 'monitor' },
    { text: 'Municipio', value: 'municipality', sortable: true },
    { text: 'Escenario Deportivo', value: 'sport_arena' },
    { text: 'Estado', value: 'status' },
    { text: 'Acciones', value: 'actions' },
]
const items = ref<Item[]>([
    { id: '1', date: '2023-02-11', monitor: 'Juan', municipality: 'Cartago', sport_arena: 'Estadio Nacional', status: { id: 1, name: 'Aprobado', slug: 'APR' } },
    { id: '2', date: '2023-02-11', monitor: 'Pedro', municipality: 'Cartago', sport_arena: 'Estadio Nacional', status: { id: 2, name: 'En Revisión', slug: 'ENR' } },
    { id: '3', date: '2023-02-11', monitor: 'Juan', municipality: 'Cartago', sport_arena: 'Estadio Nacional', status: { id: 1, name: 'Aprobado', slug: 'APR' } },
    { id: '4', date: '2023-02-11', monitor: 'Maria', municipality: 'Cartago', sport_arena: 'Estadio Nacional', status: { id: 4, name: 'Rechazado', slug: 'REC' } },
    { id: '5', date: '2023-02-11', monitor: 'Jose', municipality: 'Cartago', sport_arena: 'Estadio Nacional', status: { id: 1, name: 'Aprobado', slug: 'APR' } },
]);

const headerCustomVisits: Header[] = [
    { text: 'No', value: 'id', sortable: true },
    { text: 'Mes', value: 'month', sortable: true },
    { text: 'Municipio', value: 'municipality', sortable: true },
    { text: 'Beneficiario', value: 'beneficiary' },
    { text: 'Estado', value: 'status' },
    { text: 'Acciones', value: 'actions' },
]

const items2 = ref<Item[]>([
    {
        id: '1',
        month: 'Enero',
        municipality: 'Cartago',
        beneficiary: 'Juan',
        status: {
            id: 1,
            name: 'Aprobado',
            slug: 'APR'
        }
    },
    {
        id: '2',
        month: 'Enero',
        municipality: 'Cartago',
        beneficiary: 'Pedro',
        status: {
            id: 2,
            name: 'En Revisión',
            slug: 'ENR'
        }
    },
    {
        id: '3',
        month: 'Enero',
        municipality: 'Cartago',
        beneficiary: 'Juan',
        status: {
            id: 4,
            name: 'Rechazado',
            slug: 'REC'}
    },
    {
        id: '4',
        month: 'Enero',
        municipality: 'Cartago',
        beneficiary: 'Maria',
        status: {
            id: 4,
            name: 'Rechazado',
            slug: 'REC'}
    },
    {
        id: '5',
        month: 'Enero',
        municipality: 'Cartago',
        beneficiary: 'Jose',
        status: {
            id: 1,
            name: 'Aprobado',
            slug: 'APR'
        }
    },
    {
        id: '6',
        month: 'Enero',
        municipality: 'Cartago',
        beneficiary: 'Luis',
        status: {
            id: 1,
            name: 'Aprobado',
            slug: 'APR'}
    },
    {
        id: '7',
        month: 'Enero',
        municipality: 'Cartago',
        beneficiary: 'Maria',
        status: {
            id: 2,
            name: 'En Revisión',
            slug: 'ENR'}
    },
    {
        id: '8',
        month: 'Enero',
        municipality: 'Cartago',
        beneficiary: 'Pedro',
        status: {
            id: 4,
            name: 'Rechazado',
            slug: 'REC'}
    },
    {
        id: '9',
        month: 'Enero',
        municipality: 'Cartago',
        beneficiary: 'Juan',
        status: {
            id: 1,
            name: 'Aprobado',
            slug: 'APR'}
    },
    {
        id: '10',
        month: 'Enero',
        municipality: 'Cartago',
        beneficiary: 'Luis',
        status: {
            id: 1,
            name: 'Aprobado',
            slug: 'APR'}
    },

])

const headerTransversalActivities: Header[] = [
    { text: 'No', value: 'id', sortable: true },
    { text: 'Municipio', value: 'name', sortable: true },
    { text: 'Fecha', value: 'email' },
    { text: 'Numero de Asistentes', value: 'email', sortable: true },
    { text: 'Estado', value: 'email' },
]

const selectedTab = ref(1);
provide('selectedTab', selectedTab)

const visits = ref<Item[]>([]);
const searchVisits = ref('');
const dataSearchVisits = computed(() => searchData(items.value, searchVisits.value));


const customVisits = ref<Item[]>([]);
const searchCustomVisits = ref('');
const dataSearchCustomVisits = computed(() => searchData(items2.value, searchCustomVisits.value));

const transversalActivities = ref<Item[]>([]);
const searchTransversalActivities = ref('');
const dataSearchTransversalActivities = computed(() => searchData(transversalActivities.value, searchTransversalActivities.value));


// onBeforeMount(async () => {
// 	await customVisitServices.getAll().then((response) => {
// 		customVisits.value = response?.data.items
// 		console.log(customVisits.value)
// 	});
// });

</script>

<template>
    <TabGroup>
        <TabList class="py-5">

            <Tab as="template" v-slot="{ selected }">
                <button @click="selectedTab = 1"
                    :class="{ 'select-none inline-block p-2 text-slate-800 font-medium dark:text-slate-400 border-b-2 border-b-primary rounded-t-lg active outline-none': selected, 'select-none inline-block p-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300': !selected }">
                    Visitas
                </button>
            </Tab>
            <Tab as="template" v-slot="{ selected }">
                <button @click="selectedTab = 2"
                    :class="{ 'select-none inline-block p-2 text-slate-800 font-medium dark:text-slate-400 border-b-2 border-b-primary rounded-t-lg active outline-none': selected, 'select-none inline-block p-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300': !selected }">
                    Visitas Personalizadas
                </button>
            </Tab>
            <Tab as="template" v-slot="{ selected }">
                <button @click="selectedTab = 3"
                    :class="{ 'select-none inline-block p-2 text-slate-800 font-medium dark:text-slate-400 border-b-2 border-b-primary rounded-t-lg active outline-none': selected, 'select-none inline-block p-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300': !selected }">
                    Actividades Transversales
                </button>
            </Tab>
        </TabList>
        <TabPanels>
            <TabPanel>
                <CommonInput type="search" name="search" v-model="searchVisits" placeholder="Buscar" />
                <Crud :headers="headerVisits" :items="dataSearchVisits" />
            </TabPanel>
            <TabPanel>
                <CommonInput type="search" name="search" v-model="searchCustomVisits" placeholder="Buscar" />
                <Crud :headers="headerCustomVisits" :items="dataSearchCustomVisits" />
            </TabPanel>
            <TabPanel>
                <CommonInput type="search" name="search" v-model="searchTransversalActivities" placeholder="Buscar" />
                <Crud :headers="headerTransversalActivities" :items="dataSearchTransversalActivities" />
            </TabPanel>
        </TabPanels>
    </TabGroup>
</template>