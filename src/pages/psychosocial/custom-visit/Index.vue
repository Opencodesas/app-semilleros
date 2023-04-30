<script setup lang="ts">
import { Header, Item } from 'vue3-easy-data-table';
import { searchData } from '@/composables/search';
import { customVisitServices } from '@/services/psychosocial/customVisitServices';
import { onboardingStore } from '@/stores/onboardingStore';

const store = onboardingStore();

//Traer visitas personalizadas

 onBeforeMount(async () => {
     await customVisitServices.getAll().then((response) => {
          customVisits.value = response?.data.items
          console.log(response?.data.items)
          console.log(store.get_user_role)
      })
 })

const headerCustomVisits: Header[] = [
    { text: 'No', value: 'id', sortable: true },
    { text: 'Mes', value: 'months.name', sortable: true },
    { text: 'Municipio', value: 'municipalities.name', sortable: true },
    { text: 'Beneficiario', value: 'beneficiaries.full_name' },
    { text: 'Estado', value: 'status' },
    { text: 'Acciones', value: 'actions' },
];

const items2 = ref<Item[]>([
    {
        id: '1',
        month: 'Enero',
        municipality: 'Cartago',
        beneficiary: 'Juan',
        status: {
            id: 1,
            name: 'Aprobado',
            slug: 'APR',
        },
    },
    {
        id: '2',
        month: 'Enero',
        municipality: 'Cartago',
        beneficiary: 'Pedro',
        status: {
            id: 2,
            name: 'En Revisión',
            slug: 'ENR',
        },
    },
    {
        id: '3',
        month: 'Enero',
        municipality: 'Cartago',
        beneficiary: 'Juan',
        status: {
            id: 4,
            name: 'Rechazado',
            slug: 'REC',
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
            slug: 'REC',
        },
    },
    {
        id: '5',
        month: 'Enero',
        municipality: 'Cartago',
        beneficiary: 'Jose',
        status: {
            id: 1,
            name: 'Aprobado',
            slug: 'APR',
        },
    },
    {
        id: '6',
        month: 'Enero',
        municipality: 'Cartago',
        beneficiary: 'Luis',
        status: {
            id: 1,
            name: 'Aprobado',
            slug: 'APR',
        },
    },
    {
        id: '7',
        month: 'Enero',
        municipality: 'Cartago',
        beneficiary: 'Maria',
        status: {
            id: 2,
            name: 'En Revisión',
            slug: 'ENR',
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
            slug: 'REC',
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
            slug: 'APR',
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
            slug: 'APR',
        },
    },
]);

//Cambiar items2 por customVisits
const customVisits = ref<Item[]>([]);
const searchCustomVisits = ref('');
const dataSearchCustomVisits = computed(() => searchData(customVisits.value, searchCustomVisits.value));

</script>

<template>
    <div class="p-5 mt-5 intro-y box">
        <CommonInput type="search" name="search" v-model="searchCustomVisits" placeholder="Buscar" />
        <Crud :headers="headerCustomVisits" :items="dataSearchCustomVisits" />
    </div>
</template>
