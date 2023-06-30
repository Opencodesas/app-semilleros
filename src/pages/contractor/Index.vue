<script setup lang="ts">
import CommonButtonLink from '@/components/CommonButtonLink.vue';
import Crud from '@/components/Crud.vue'
import { Header, Item } from 'vue3-easy-data-table';

const { find } = useApiV1()
const { isProvider } = useProvider()

const { state: Contractors, isLoading, error, execute } = useAsyncState(() => find<{ items: Item[]}>('contractors').then((response) => response.data.items), null)

const headers: Header[] = [
    { text: 'ID', value: 'id' },
    { text: 'NOMBRE COMPLETO', value: 'full_name', sortable: true },
    { text: 'CÉDULA', value: 'identification', sortable: true},
    { text: 'CORREO', value: 'email' },
    { text: 'DEPARTAMENTO', value: 'department.name' },
    { text: 'MUNICIPIO', value: 'municipality.name' },
    { text: 'CELULAR', value: 'phone' },
    { text: 'DIRECCIÓN', value: 'address' },
    { text: 'PERIODO VIGENCIA', value: 'validator_periods.term' },
    { text: 'DOCUMENTOS', value: 'documents', sortable: true },
    { text: 'CREACIÓN', value: 'created_at' },
    { text: 'ESTADO', value: 'status', width: 120 },
    { text: 'ACCIONES', value: 'actions'},
]
</script>

<template>
    <div class="flex items-center mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">Listado Contratistas</h2>
        <div class="w-full sm:w-auto flex mt-4 sm:mt-0">
            <CommonButtonLink variant="hotbed" :to="{ name: isProvider('assistants') ? 'assistants.contractorsCreate' : 'contractors.store' }" >
                Crear Contratista
            </CommonButtonLink>
        </div>
    </div>
    <!-- BEGIN: Page Layout -->
    <div class="p-5 mt-5 intro-y box">
        <template v-if="isLoading">
            <RequestHandleLoading />
        </template>
        <template v-else-if="error">
            <RequestHandleError @click="execute" />
        </template>
        <template v-else-if="Contractors != null">
            <Crud :headers="headers" :items="Contractors" />
        </template>
    </div>
    <!-- END: Page Layout -->
</template>
