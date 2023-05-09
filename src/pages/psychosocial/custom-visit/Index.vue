<script setup lang="ts">
import { Header, Item } from 'vue3-easy-data-table';
import { searchData } from '@/composables/search';
import { customVisitServices } from '@/services/psychosocial/customVisitServices';
import { onboardingStore } from '@/stores/onboardingStore';

const store = onboardingStore();

 onBeforeMount(async () => {
     await customVisitServices.getAll().then((response) => {
          customVisits.value = response?.data.items
      })
 })

const headerCustomVisits: Header[] = [
    { text: 'Mes', value: 'months.name', sortable: true },
    { text: 'Municipio', value: 'municipalities.name', sortable: true },
    { text: 'Beneficiario', value: 'beneficiaries.full_name' },
    { text: 'Estado', value: 'status' },
    { text: 'Acciones', value: 'actions' },
];


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
