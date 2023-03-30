<script setup lang="ts">
import { Header, Item } from 'vue3-easy-data-table';
import { customVisitServices } from '@/services/psychosocial/customVisitServices';
import { searchData } from '@/composables/search';
import customVisitReview from './CustomVisitReview.vue'


const route = useRoute()

//Traer visitas personalizadas en revisión

const items = ref<Item[]>([
    {
        id: '1',
        month: 'Enero',
        created_by: 'Pedro', //Nombre del usuario (Psicologo) que creo la visita
        municipality: 'Cartago',
        beneficiary: 'Juan Perez',//Nombre del beneficiario
        status: {
            id: 2,
            name: 'En Revisión',
            slug: 'ENR'
        },
    },
    {
        id: '2',
        month: 'Enero',
        created_by: 'Pedro', //Nombre del usuario (Psicologo) que creo la visita
        municipality: 'Cartago',
        beneficiary: 'Juan Perez',//Nombre del beneficiario
        status: {
            id: 2,
            name: 'En Revisión',
            slug: 'ENR'
        },
    },
    {
        id: '3',
        month: 'Enero',
        created_by: 'Pedro', //Nombre del usuario (Psicologo) que creo la visita
        municipality: 'Cartago',
        beneficiary: 'Juan Perez',//Nombre del beneficiario
        status: {
            id: 2,
            name: 'En Revisión',
            slug: 'ENR'
        },
    },
])

const headerCustomVisits: Header[] = [
    { text: 'No', value: 'id', sortable: true },
    { text: 'Mes', value: 'month', sortable: true },
    { text: 'Usuario', value: 'created_by', sortable: true },
    { text: 'Municipio', value: 'municipality', sortable: true },
    { text: 'Beneficiario', value: 'beneficiary' },
    { text: 'Estado', value: 'status' },
    { text: 'Acciones', value: 'actions' },
]

//const v$ = useVuelidate(form_rules, form)

const { isProvider } = useProvider()
const router = useRouter()

//Funciones para modal aun en desrrollo
// const isOpen = ref(false)

// function closeModal() {
//     isOpen.value = false
// }
// function openModal() {
//     isOpen.value = true
// }

const search = ref('');
const dataSearch = computed(() => searchData(items.value, search.value));

</script>

<template>
    <div class="p-5 mt-5 intro-y box">
        <CommonInput type="search" name="search" v-model="search" placeholder="Buscar" />
        <Crud :headers="headerCustomVisits" :items="items" :Form="customVisitReview" />
    </div>
</template>
