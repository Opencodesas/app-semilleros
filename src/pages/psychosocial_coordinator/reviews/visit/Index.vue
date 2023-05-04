<script setup lang="ts">
import { Header, Item } from 'vue3-easy-data-table';
import { searchData } from '@/composables/search';
import visitReview from './visitReview.vue'
import { visitServices } from '@/services/psychosocial/visitServices';


const headerVisits: Header[] = [
    { text: 'Fecha', value: 'date_visit', sortable: true },
    { text: 'Usuario', value: 'createdBY.name' },
    { text: 'Municipio', value: 'municipality.name', sortable: true },
    { text: 'Escenario Deportivo', value: 'scenery' },
    { text: 'Estado', value: 'status', sortable: true },
    { text: 'Acciones', value: 'actions' },
]

const visits = ref<Item[]>([]);

onBeforeMount(async () => {
     await visitServices.getAll().then((response) => {
        visits.value = response?.data.items
      })
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
