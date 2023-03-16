<script setup lang="ts">
import Crud from '@/components/Crud.vue'
import RequestHandleError from '@/components/RequestHandleError.vue';
import RequestHandleLoading from '@/components/RequestHandleLoading.vue';
import { Header, Item } from 'vue3-easy-data-table'

const router = useRouter()
const { isProvider } = useProvider()

const { find } = useApiV1()

const { state: contractors, isLoading, error, execute } = useAsyncState(async () => {
    if (isProvider('legalMaster')) {
        return await find<Item[]>('clever-documents').then((response) => response.data)
    }
    else {
        return await find<{ items: Item[] }>('contractors').then((response) => {
            console.log(response.data.items)
            return response.data.items
        })
    }
}, null)

router.afterEach(() => {
    execute()
})

const headers: Header[] = [
    { text: 'CONSECUTIVO', value: 'consecutive' },
    { text: 'NOMBRE CONTRATISTA', value: 'name' },
    { text: 'CÉDULA', value: 'identification' },
    { text: 'DOCUMENTOS', value: 'documents' },
    { text: 'ESTADO', value: 'status' },
    { text: 'ACCIONES', value: 'actionsDocuments' },
]
</script>

<template>
    <div class="flex items-center mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">
            {{ isProvider('legal') ? 'Revision de Documentos' : isProvider('legalMaster') ? 'Revision de Contratistas' : 'Documentos' }}
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
