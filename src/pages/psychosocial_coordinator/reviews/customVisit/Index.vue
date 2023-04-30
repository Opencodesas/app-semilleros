<script setup lang="ts">
import { Header, Item } from 'vue3-easy-data-table';
import { searchData } from '@/composables/search';
import customVisitReview from './CustomVisitReview.vue'
import { customVisitServices } from '@/services/psychosocial/customVisitServices';
import { onboardingStore } from '@/stores/onboardingStore';


const headerCustomVisits: Header[] = [
    { text: 'Mes', value: 'months.name', sortable: true },
    { text: 'Usuario', value: 'createdBy.name', sortable: true },
    { text: 'Municipio', value: 'municipalities.name', sortable: true },
    { text: 'Beneficiario', value: 'beneficiaries.full_name' },
    { text: 'Estado', value: 'status' },
    { text: 'Acciones', value: 'actions' },
]

const customVisits = ref<Item[]>([]);


onBeforeMount(async () => {
    console.log(onboardingStore().user)
     await customVisitServices.getAll().then((response) => {
          customVisits.value = response?.data.items
          console.log(response?.data.items)
      })
      console.log(customVisits.value)
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
