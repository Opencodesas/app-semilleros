<script setup lang="ts">
import { Header, Item } from 'vue3-easy-data-table';
import { searchData } from '@/composables/search';
import customVisitReview from './CustomVisitReview.vue'
import { customVisitServices } from '@/services/psychosocial/customVisitServices';



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
    { text: 'Mes', value: 'months.name', sortable: true },
    { text: 'Usuario', value: 'createdBy.name', sortable: true },
    { text: 'Municipio', value: 'municipalities.name', sortable: true },
    { text: 'Beneficiario', value: 'beneficiaries.full_name' },
    { text: 'Estado', value: 'status' },
    { text: 'Acciones', value: 'actions' },
]

const customVisits = ref<Item[]>([]);

onBeforeMount(async () => {
     await customVisitServices.getAll().then((response) => {
          customVisits.value = response?.data.items
          console.log(response?.data.items)
      })
 })

const search = ref('');
const dataSearch = computed(() => searchData(customVisits.value, search.value));

</script>

<template>
    <div class="p-5 mt-5 intro-y box">
        <CommonInput type="search" name="search" v-model="search" placeholder="Buscar" />
        <Crud :headers="headerCustomVisits" :items="dataSearch" :Form="customVisitReview" />
    </div>
</template>
