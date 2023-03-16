<script setup lang="ts">




import { required } from '@vuelidate/validators'
import CommonTextarea from '@/components/CommonTextarea.vue';
import ContractorDocumentsType, { DocumentName } from '@/types/contractorDocumentsTypes';
import DocumentManagement from '@/components/DocumentManagement.vue';
import DocumentPreviewer from '@/components/DocumentPreviewer.vue';
import useVuelidate from '@vuelidate/core'
import RequestHandleError from '@/components/RequestHandleError.vue';
import RequestHandleLoading from '@/components/RequestHandleLoading.vue';
import getDocumentLabel from '@/helpers/getDocumentLabel'

const router = useRouter()
const route = useRoute()
const { isProvider } = useProvider()
const { findOne, update } = useApiV1()

const formStatus = reactive({
    doc_1: 3,
    doc_2: 3,
    doc_3: 3,
    doc_4: 3,
    doc_5: 3,
    doc_6: 3,
    doc_7: 3,
    doc_8: 3,
    doc_9: 3,
    doc_10: 3,
    doc_11: 3,
    doc_12: 3,
    doc_13: 3,
    doc_14: 3,
    doc_15: 3,
    doc_15_1: 3,
    doc_15_2: 3,
    doc_15_3: 3,
    doc_16: 3,
    doc_17: 3,
    doc_18: 3
})

const isRejected = computed(() => Object.values(formStatus).some(value => value == 4))

const form = reactive({
    reject_note: ''
})

const form_rules = computed(() => ({
    reject_note: isRejected.value ? { required } : {}
}))

const v$ = useVuelidate(form_rules, form)

// const response = await api.get(`/${apiPath}/documents/${id}`).finally(() => {

// const { state: documentsFetched } = useAsyncState(() => findOne<{ items: ContractorDocumentsType[] }>('documents', route.query.contractor as string).then((response) => response.data.items), null)

const documentsQueue = () => findOne<{ items: ContractorDocumentsType[] }>('documents', route.query.contractor as string)
    .then((response) => {
        response.data.items.forEach(doc => {
            if (doc.status.slug == 'ENR') {
                formStatus[doc.name] = 3
            }
            else {
                formStatus[doc.name] = doc.status.id
            }
        })

        return response.data.items
    })

const { result } = useAsyncQueue([documentsQueue])

const documents = computedAsync(() => {
    return result[0].data
}, null)

const getDocumentPath = (name: DocumentName) => {
    const handle = computed(() => {
        return documents.value?.find(doc => doc.name === name)?.path
    })

    return handle.value
}

onBeforeMount(async () => {
    if (!route.query.contractor) {
        router.go(-1)
    }
})

const onSubmit = async () => {
    const valid = await v$.value.$validate()

    if (valid) {
        setLoading(true)

        update('documents-management', {
            data: documents.value?.map((document) => ({ document_id: document.id, status_id: formStatus[document.name] })),
            reject_note: form.reject_note
        }).then((response) => {
            if (response.status >= 200 && response.status <= 300) {
                alerts.custom('Éxito', 'La gestión de documentos fue exitosa.', 'info')
                router.go(-1)
            }
        })
        .finally(() => {
            setLoading(false)
        })
    }
    else {
        alerts.validation()
    }
}
</script>

<template>
    <div class="flex items-center justify-between mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">Revision de Documentos</h2>
    </div>
    <div class="p-5 mt-5 intro-y box">
        <template v-if="result[0].state === 'pending'">
            <RequestHandleLoading />
        </template>
        <template v-else-if="result[0].state === 'rejected'">
            <RequestHandleError @click="$router.go(0)" />
        </template>
        <template v-else-if="result[0].state === 'fulfilled'">
            <form @submit.prevent="onSubmit" class="space-y-8 divide-y divide-slate-200">
                <div>
                    <h3 class="text-lg font-medium leading-6 text-gray-900">
                        Documentos
                    </h3>
                    <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2 md:grid-cols-3">
                        <template v-for="document in documents">
                            <DocumentPreviewer :label="getDocumentLabel(document.name)"
                                :source="getDocumentPath(document.name)" :name="document.name">
                                <template #footer>
                                    <DocumentManagement :name="`${document.name}status`"
                                        v-model="formStatus[document.name]" />
                                </template>
                            </DocumentPreviewer>
                        </template>
                    </div>
                </div>
                <template v-if="isRejected">
                    <div class="intro-x pt-5">
                        <div class="grid grid-cols-1 gap-y-6 gap-x-4">
                            <CommonTextarea :disabled="!isRejected" rows="5" label="Nota de Rechazo" name="reject_note" v-model="form.reject_note"
                                :validator="v$" />
                        </div>
                    </div>
                </template>
                <div class="pt-5">
                    <div class="flex justify-end gap-x-4">
                        <Button type="button" variant="outline-secondary" @click="$router.go(-1)">
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary">
                            Guardar
                        </Button>
                    </div>
                </div>
            </form>
        </template>
</div>
</template>