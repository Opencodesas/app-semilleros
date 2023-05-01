<script setup lang="ts">
import { Header, Item } from 'vue3-easy-data-table';
import { searchData } from '@/composables/search';
import visitReview from './visitReview.vue'
import { visitServices } from '@/services/psychosocial/visitServices';


//Traer visitas personalizadas en revisión

const headerVisits: Header[] = [
    { text: 'Fecha', value: 'date_visit', sortable: true },
    { text: 'Usuario', value: 'createdBY.name' },
    { text: 'Municipio', value: 'municipality.name', sortable: true },
    { text: 'Escenario Deportivo', value: 'scenery' },
    { text: 'Estado', value: 'status', sortable: true },
    { text: 'Acciones', value: 'actions' },
]
// const items = ref<Item[]>([
//     { id: '1', date: '2023-02-11', created_by: 'Juan', municipality: 'Cartago', sport_arena: 'Estadio Nacional', status: { id: 1, name: 'En Revisión', slug: 'ENR' } },
//     { id: '2', date: '2023-02-11', created_by: 'Pedro', municipality: 'Cartago', sport_arena: 'Estadio Nacional', status: { id: 1, name: 'En Revisión', slug: 'ENR' } },
//     { id: '3', date: '2023-02-11', created_by: 'Juan', municipality: 'Cartago', sport_arena: 'Estadio Nacional', status: { id: 1, name: 'En Revisión', slug: 'ENR' } },
//     { id: '4', date: '2023-02-11', created_by: 'Maria', municipality: 'Cartago', sport_arena: 'Estadio Nacional', status: { id: 1, name: 'En Revisión', slug: 'ENR' } },
//     { id: '5', date: '2023-02-11', created_by: 'Jose', municipality: 'Cartago', sport_arena: 'Estadio Nacional', status: { id: 1, name: 'En Revisión', slug: 'ENR' } },
// ]);

const visits = ref<Item[]>([]);

onBeforeMount(async () => {
     await visitServices.getAll().then((response) => {
        visits.value = response?.data.items
          console.log(response?.data.items)
      })
      console.log(visits.value)
 })

const search = ref('');
const dataSearch = computed(() => searchData(visits.value, search.value));

</script>

<template>
    <div class="p-5 mt-5 intro-y box">
        <CommonInput type="search" name="search" v-model="search" placeholder="Buscar" />
        <Crud :headers="headerVisits" :items="dataSearch" :Form="visitReview" />
    </div>
</template>
