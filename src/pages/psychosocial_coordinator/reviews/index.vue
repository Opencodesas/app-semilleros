<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { required } from '@/utils/validators'
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import { Header, Item } from 'vue3-easy-data-table';
import { customVisitServices } from '@/services/psychosocial/customVisitServices';
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle,
} from '@headlessui/vue'


const route = useRoute()

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
    { id: '1', date: '2023-02-11', monitor: 'Juan', municipality: 'Cartago', sport_arena: 'Estadio Nacional', status: { id: 1, name: 'Aprobado', slug: 'APR' } },
    { id: '2', date: '2023-02-11', monitor: 'Pedro', municipality: 'Cartago', sport_arena: 'Estadio Nacional', status: { id: 2, name: 'En Revisión', slug: 'ENR' } },
    { id: '3', date: '2023-02-11', monitor: 'Juan', municipality: 'Cartago', sport_arena: 'Estadio Nacional', status: { id: 1, name: 'Aprobado', slug: 'APR' } },
    { id: '4', date: '2023-02-11', monitor: 'Maria', municipality: 'Cartago', sport_arena: 'Estadio Nacional', status: { id: 4, name: 'Rechazado', slug: 'REC' } },
    { id: '5', date: '2023-02-11', monitor: 'Jose', municipality: 'Cartago', sport_arena: 'Estadio Nacional', status: { id: 1, name: 'Aprobado', slug: 'APR' } },
])

const headerVisits: Header[] = [
    { text: 'No.', value: 'id', sortable: true },
    { text: 'Fecha', value: 'date', sortable: true },
    { text: 'Usuario', value: 'monitor' },
    { text: 'Municipio', value: 'municipality', sortable: true },
    { text: 'Escenario Deportivo', value: 'sport_arena' },
    { text: 'Estado', value: 'status' },
    { text: 'Acciones', value: 'actions' },
]

const headerCustomVisits: Header[] = [
    { text: 'No', value: 'id', sortable: true },
    { text: 'Mes', value: 'month', sortable: true },
    { text: 'Usuario', value: 'monitor', sortable: true },
    { text: 'Municipio', value: 'municipality', sortable: true },
    { text: 'Beneficiario', value: 'beneficiary' },
    { text: 'Estado', value: 'status' },
    { text: 'Acciones', value: 'actions' },
]

//const v$ = useVuelidate(form_rules, form)

const { isProvider } = useProvider()
const router = useRouter()

const isOpen = ref(false)

function closeModal() {
    isOpen.value = false
}
function openModal() {
    isOpen.value = true
}

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
        </TabList>
        <TabPanels>
            <TabPanel>
                <Crud :headers="headerVisits" :items="items2" />
            </TabPanel>
            <TabPanel>
                <Crud :headers="headerCustomVisits" :items="items" />
            </TabPanel>
        </TabPanels>
    </TabGroup>

    <div>
        <!-- BEGIN: Modal Toggle -->
        <div class="text-center">
            <div class="flex">
                <Button type="button" variant="outline-warning" @click="openModal">
                    <Lucide icon="FileX" class="mr-2" />
                    <span class="text-sm">
                        Anular
                    </span>
                </Button>
            </div>
            <TransitionRoot appear :show="isOpen" as="template">
                <Dialog as="div" class="relative z-[100]">
                    <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0"
                        enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                        <div class="fixed inset-0 bg-black bg-opacity-25" />
                    </TransitionChild>

                    <div class="fixed inset-0 overflow-y-auto">
                        <div class="flex min-h-full items-center justify-center p-4 text-center">
                            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
                                enter-to="opacity-100 scale-100" leave="duration-200 ease-in"
                                leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
                                <DialogPanel
                                    class="w-full max-w-md transform overflow-hidden rounded-md bg-white p-6 text-left align-middle shadow-xl transition-all divide-y divide-slate-200 space-y-2">
                                    <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                                        Anulación de Contrato para 
                                        
                                    </DialogTitle>
                                    
                                    <FormEdit />
                                        <div class="flex justify-end mt-4 space-x-4">
                                            <Button type="button" variant="soft-secondary" @click="closeModal">
                                                Cancelar
                                            </Button>
                                            <Button type="submit" variant="soft-warning">
                                                Enviar
                                            </Button>
                                        </div>
                                    <!-- </form> -->
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </TransitionRoot>
        </div>
    </div>
</template>
