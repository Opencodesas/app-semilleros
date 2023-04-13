<script setup lang="ts">
import { Header, Item } from 'vue3-easy-data-table';
import { searchData } from '@/composables/search';
import visitReview from './visitReview.vue'


//Traer visitas personalizadas en revisión

const headerVisits: Header[] = [
    { text: 'No.', value: 'id', sortable: true },
    { text: 'Fecha', value: 'date', sortable: true },
    { text: 'Usuario', value: 'created_by' },
    { text: 'Municipio', value: 'municipality', sortable: true },
    { text: 'Escenario Deportivo', value: 'sport_arena' },
    { text: 'Estado', value: 'status' },
    { text: 'Acciones', value: 'actions' },
]
const items = ref<Item[]>([
    { id: '1', date: '2023-02-11', created_by: 'Juan', municipality: 'Cartago', sport_arena: 'Estadio Nacional', status: { id: 1, name: 'En Revisión', slug: 'ENR' } },
    { id: '2', date: '2023-02-11', created_by: 'Pedro', municipality: 'Cartago', sport_arena: 'Estadio Nacional', status: { id: 1, name: 'En Revisión', slug: 'ENR' } },
    { id: '3', date: '2023-02-11', created_by: 'Juan', municipality: 'Cartago', sport_arena: 'Estadio Nacional', status: { id: 1, name: 'En Revisión', slug: 'ENR' } },
    { id: '4', date: '2023-02-11', created_by: 'Maria', municipality: 'Cartago', sport_arena: 'Estadio Nacional', status: { id: 1, name: 'En Revisión', slug: 'ENR' } },
    { id: '5', date: '2023-02-11', created_by: 'Jose', municipality: 'Cartago', sport_arena: 'Estadio Nacional', status: { id: 1, name: 'En Revisión', slug: 'ENR' } },
]);

//const v$ = useVuelidate(form_rules, form)


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
        <Crud :headers="headerVisits" :items="dataSearch" :Form="visitReview" />
    </div>
</template>
