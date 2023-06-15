<script setup lang="ts">
import { Header, Item } from 'vue3-easy-data-table';
import transversalActivityReview from './transversalActivityReview.vue'

const header: Header[] = [
    { text: 'Usuario', value: 'creator.name', sortable: true },
    { text: 'Municipio', value: 'municipalities.name' },
    { text: 'Fecha', value: 'date_visit', sortable: true },
    { text: 'Número de Asistentes', value: 'nro_assistants' },
    { text: 'Estado', value: 'status', sortable: true },
    { text: 'Acciones', value: 'actions' },
]

onBeforeMount(async () => {
    await transversalActivityServices.getAll().then((response) => {
        transversalActivities.value = response?.data.items
        console.log(transversalActivities.value)
    })
})


const transversalActivities = ref<Item[]>([]);
const search = ref('');
const dataSearch = computed(() => searchData(transversalActivities.value, search.value));

</script>

<template>
    <div class="m-5"><h1 class="mr-auto text-lg font-medium">Actividades Transversales </h1></div>

    <div class="p-5 mt-5 intro-y space-y-2 box">
        <CommonInput type="search" name="search" v-model="search" placeholder="Buscar" />
        <Crud :headers="header" :items="dataSearch" :Form="transversalActivityReview"/>
    </div>
</template>