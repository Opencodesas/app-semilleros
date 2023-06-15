<script setup lang="ts">
import { Header, Item } from 'vue3-easy-data-table';
import { searchData } from '@/composables/search';
import ChronogramReview from './ChronogramReview.vue';
import { onboardingStore } from "@/stores/onboardingStore";

let currentUser = {id: onboardingStore().get_user.id, name: onboardingStore().get_user.name, rol: onboardingStore().get_user_role?.slug};
const headerVisits: Header[] = [
    { text: 'Fecha', value: 'created_at', sortable: true },
    { text: 'Monitor', value: 'created_by.name' },
    { text: '#CC monitor', value: 'created_by.document_number'},
    { text: 'Mes', value: 'month' },
    { text: 'Municipio', value: 'municipio', sortable: true },
    { text: 'Etapa', value: 'etapa' },
    { text: 'Estado', value: 'status' },
    { text: 'Acciones', value: 'actions' },
]

const chronograms = ref<Item[]>([]);

onBeforeMount(async () => {
     await chronogramServices.getAll().then((response) => {
        chronograms.value = response?.data.items
      })
 })

const search = ref('');
const dataSearch = computed(() => searchData(chronograms.value, search.value));

</script>

<template>
    <div class="p-5 mt-5 intro-y box" v-if="currentUser.rol==='subdirector_tecnico' || currentUser.rol==='metodologo' || currentUser.rol==='super.root'">
        <CommonInput type="search" name="search" v-model="search" placeholder="Buscar" />
        <Crud :headers="headerVisits" :items="dataSearch" :Form="ChronogramReview" />
    </div>
</template>
