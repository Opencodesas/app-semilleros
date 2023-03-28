<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { required } from '@/utils/validators'
import { Header, Item } from 'vue3-easy-data-table';
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import FormSwitch from "@/base-components/Form/FormSwitch";
import { filePondValue } from '@/composables/useFilepondEvents';
import { customVisitServices } from '@/services/psychosocial/customVisitServices';


const { multiple } = useFilepondEvents();

const router = useRouter()
const route = useRoute()


const routeName = computed(() => {
    return String(route.name).split('.')[0]
})

const prueba = () => {
    console.log('prueba')
}

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

const items2 = ref<Item[]>([
    {id: '1', date: '2023-02-11', monitor: 'Juan', municipality: 'Cartago', sport_arena: 'Estadio Nacional', status: {id: 1, name: 'Aprobado', slug: 'APR'}},
    {id: '2', date: '2023-02-11', monitor: 'Pedro', municipality: 'Cartago', sport_arena: 'Estadio Nacional', status: {id: 2, name: 'En Revisión', slug: 'ENR'}},
    {id: '3', date: '2023-02-11', monitor: 'Juan', municipality: 'Cartago', sport_arena: 'Estadio Nacional', status: {id: 1, name: 'Aprobado', slug: 'APR'}},
    {id: '4', date: '2023-02-11', monitor: 'Maria', municipality: 'Cartago', sport_arena: 'Estadio Nacional', status: {id: 4, name: 'Rechazado', slug: 'REC'}},
    {id: '5', date: '2023-02-11', monitor: 'Jose', municipality: 'Cartago', sport_arena: 'Estadio Nacional', status: {id: 1, name: 'Aprobado', slug: 'APR'}},
])

onMounted(() => {
    console.log(console.log(items))
})


const headerVisits: Header[] = [
    { text: 'No.', value: 'id', sortable: true },
    { text: 'Fecha', value: 'date', sortable: true },
    { text: 'Monitor', value: 'monitor' },
    { text: 'Municipio', value: 'municipality', sortable: true },
    { text: 'Escenario Deportivo', value: 'sport_arena' },
    { text: 'Estado', value: 'status' },
]

const headerCustomVisits: Header[] = [
    { text: 'No', value: 'id', sortable: true },
    { text: 'Mes', value: 'month', sortable: true },
    { text: 'Municipio', value: 'municipality', sortable: true },
    { text: 'Beneficiario', value: 'beneficiary' },
    { text: 'Estado', value: 'status'},
    { text: 'Acciones', value: 'actions'},
]

const headerTransversalActivities: Header[] = [
    { text: 'No', value: 'id', sortable: true },
    { text: 'Municipio', value: 'name', sortable: true },
    { text: 'Fecha', value: 'email' },
    { text: 'Numero de Asistentes', value: 'email', sortable: true },
    { text: 'Estado', value: 'email' },
]

</script>

<template>
   
    <TabGroup>
        <TabList class="py-5">
            <!-- Use the `selected` state to conditionally style the selected tab. -->
            <Tab as="template" v-slot="{ selected }">
                <button
                    :class="{ 'inline-block p-2 text-slate-800 font-medium dark:text-slate-400 border-b-2 border-b-primary rounded-t-lg active outline-none': selected, 'inline-block p-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300': !selected }">
                    Visitas
                </button>
            </Tab>
            <Tab as="template" v-slot="{ selected }">
                <button
                    :class="{ 'inline-block p-2 text-slate-800 font-medium dark:text-slate-400 border-b-2 border-b-primary rounded-t-lg active outline-none': selected, 'inline-block p-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300': !selected }">
                    Visitas Personalizadas
                </button>
            </Tab>
            <Tab as="template" v-slot="{ selected }">
                <button
                    :class="{ 'inline-block p-2 text-slate-800 font-medium dark:text-slate-400 border-b-2 border-b-primary rounded-t-lg active outline-none': selected, 'inline-block p-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300': !selected }">
                    Actividades Transversales
                </button>
            </Tab>
        </TabList>
        <TabPanels>
            <TabPanel>
                 <Crud :headers="headerVisits" :items="items2" :item_see_fnc="prueba"/>
            </TabPanel>
            <TabPanel>
                <Crud :headers="headerCustomVisits" :items="items" :item_see_fnc="prueba"/>
            </TabPanel>
            <TabPanel>
                <Crud :headers="headerTransversalActivities" :items="items" :item_see_fnc="prueba"/>
            </TabPanel>
        </TabPanels>
    </TabGroup>
</template>