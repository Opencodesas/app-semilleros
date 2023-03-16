<script setup lang="ts">
import Crud from '@/components/Crud.vue'
import RequestHandleError from '@/components/RequestHandleError.vue';
import RequestHandleLoading from '@/components/RequestHandleLoading.vue';
import { Header, Item } from 'vue3-easy-data-table'

const router = useRouter()
const { find } = useApiV1()

const { state: contractors, isLoading, error, execute } = useAsyncState(async () => {
    return await find<{ items: Item[] }>('contracts').then((response) => {
        console.log(response.data.items)
        return response.data.items
    })
}, null)

router.afterEach(() => {
    execute()
})

const headers: Header[] = [
    { text: 'NRO.', value: 'identifier_number' },
    { text: 'NOMBRE CONTRATISTA', value: 'contractor_fullname' },
    { text: 'CÉDULA', value: 'contractor.identification' },
    { text: 'EMAIL', value: 'contractor.email' },
    { text: 'ESCANEO', value: 'scanning_pdf' },
    { text: 'DOCUMENTOS', value: 'contractor_documents' },
    { text: 'ESTADO', value: 'status' },
    { text: 'ACCIONES', value: 'actionsContracts' },
]
</script>

<template>
    <div class="flex items-center mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">
            Contratos
        </h2>
    </div>
    <!-- BEGIN: Page Layout -->
    <div class="p-5 mt-5 intro-y box">
        <template v-if="isLoading">
            <RequestHandleLoading />
        </template>
        <template v-else-if="error">
            <RequestHandleError @click="execute" />
        </template>
        <template v-else-if="contractors != null">
            <Crud :headers="headers" :items="contractors" />
        </template>
    </div>
    <!-- END: Page Layout -->
</template>
