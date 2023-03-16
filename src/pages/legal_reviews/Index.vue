<script setup lang="ts">
import Crud from '@/components/Crud.vue'
import { Header, Item } from 'vue3-easy-data-table';

onBeforeMount(async () => {
    await contractorServices.getSuper().then((response) => {
        console.log(response?.data)
        items.value = response?.data.map((all: any) => ({ ...all, status: 'APRO' }))
    })
})

const headers: Header[] = [
    { text: 'CONSECUTIVO', value: 'consecutive' },
    { text: 'NOMBRE CONTRATISTA', value: 'name' },
    { text: 'CÉDULA', value: 'identification' },
    { text: 'DOCUMENTOS', value: 'documents' },
    { text: 'ESTADO', value: 'status' },
    { text: 'ACCIONES', value: 'actions' },
]

const items = ref<Item[]>([])
</script>

<template>
    <div class="flex items-center mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">Revision Contratistas Juridico Master</h2>
    </div>
    <!-- BEGIN: Page Layout -->
    <div class="p-5 mt-5 intro-y box">
        <Crud :headers="headers" :items="items" />
    </div>
    <!-- END: Page Layout -->
</template>
