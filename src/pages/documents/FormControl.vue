<script setup lang="ts">
import DocumentUploadInput from '@/components/DocumentUploadInput.vue'
import useVuelidate from '@vuelidate/core'
import ContractorDocumentsType, { DocumentName } from '@/types/contractorDocumentsTypes';
import RequestHandleLoading from '@/components/RequestHandleLoading.vue';
import RequestHandleError from '@/components/RequestHandleError.vue';
import getDocumentLabel from '@/helpers/getDocumentLabel'

const router = useRouter()
const route = useRoute()
const { isProvider } = useProvider()

const form = reactive({
    doc_1: '',
    doc_2: '',
    doc_3: '',
    doc_4: '',
    doc_5: '',
    doc_6: '',
    doc_7: '',
    doc_8: '',
    doc_9: '',
    doc_10: '',
    doc_11: '',
    doc_12: '',
    doc_13: '',
    doc_14: '',
    doc_15: '',
    doc_15_1: '',
    doc_15_2: '',
    doc_15_3: '',
    doc_16: '',
    doc_17: '',
    doc_18: ''
})

const form_rules = computed(() => ({
    doc_1: {},
    doc_2: {},
    doc_3: {},
    doc_4: {},
    doc_5: {},
    doc_6: {},
    doc_7: {},
    doc_8: {},
    doc_9: {},
    doc_10: {},
    doc_11: {},
    doc_12: {},
    doc_13: {},
    doc_14: {},
    doc_15: {},
    doc_15_1: {},
    doc_15_2: {},
    doc_15_3: {},
    doc_16: {},
    doc_17: {},
    doc_18: {}
}))

const docs_preview = reactive({
    doc_1: '',
    doc_2: '',
    doc_3: '',
    doc_4: '',
    doc_5: '',
    doc_6: '',
    doc_7: '',
    doc_8: '',
    doc_9: '',
    doc_10: '',
    doc_11: '',
    doc_12: '',
    doc_13: '',
    doc_14: '',
    doc_15: '',
    doc_15_1: '',
    doc_15_2: '',
    doc_15_3: '',
    doc_16: '',
    doc_17: '',
    doc_18: '',
})

const v$ = useVuelidate(form_rules, form)

const files = ref([])

const { findOne } = useApiV1()

const documentsQueue = () => findOne<{ items: Array<ContractorDocumentsType> }>('documents', route.query.contractor as string).then((response) => {
    let documents = response.data.items
    if (documents.length > 0) {
        documents.map((document) => {
            if (document.status.slug == 'REC') {
                docs_preview[document.name] = document.path
            }
        })
    }

    return response.data.items
})

const rejectNote = computedAsync(async () => {
    return await getOneWithPick('contractors', route.query.contractor as string, ['reject_note']).then((value) => value.reject_note)
}, null)


const { result } = useAsyncQueue([documentsQueue])

onBeforeMount(async () => {
    if (!route.query.contractor) {
        router.go(-1)
    }
})

// const onSubmit = async () => {
//     const values = formdataParser(form)
//     const valid = await v$.value.$validate()

//     if (valid) {
//         const response = await moduleServices.create(values)

//         if (response?.status == 200) {
//             router.go(0)
//         }
//     }
//     else {
//         alerts.validation()
//     }
// }
</script>

<template>
    <div class="flex items-center justify-between mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">Control de Documentos</h2>
        <!-- <CommonFormState consecutive="RD1" /> -->
    </div>

    <div class="p-5 mt-5 intro-y box">
        <template v-if="result[0].state == 'pending'">
            <RequestHandleLoading />
        </template>
        <template v-else-if="result[0].state == 'rejected'">
            <RequestHandleError @click="router.go(0)" />
        </template>
        <template v-else-if="result[0].state == 'fulfilled'">
            <form class="space-y-8 divide-y divide-slate-200">
                <div>
                    <h3 class="text-lg font-medium leading-6 text-gray-900">
                        Documentos Rechazados
                    </h3>
                    <div class="mt-6 grid grid-cols-2 gap-y-6 gap-x-4 md:grid-cols-3">
                        <template v-for="document in result[0].data">
                            <template v-if="document.status.slug == 'REC'">
                                <DocumentUploadInput :label="getDocumentLabel(document.name)" :name="document.name"
                                    v-model="form[document.name]" :validator="v$" :files="files"
                                    @removefile="() => form[document.name] = ''" accept_pdf
                                    :to_edit="docs_preview[document.name]" />
                            </template>
                        </template>
                    </div>
                </div>
                <div class="pt-8">
                    <h3 class="text-lg font-medium leading-6 text-gray-900">
                        Nota de Rechazo
                    </h3>
                    <div class="mt-6 grid grid-cols-1">
                        <div class="bg-slate-100 w-full text-sm border border-slate-200 p-2 shadow-sm rounded-md h-auto overflow-y-auto"
                            v-html="rejectNote" />
                    </div>
                </div>
                <div class="pt-5">
                    <div class="flex justify-end gap-x-4">
                        <Button type="button" variant="primary" @click="$router.go(-1)">
                            Guardar
                        </Button>
                    </div>
                </div>
            </form>
        </template>
    </div>
</template>