<script setup lang="ts">
import DocumentUploadInput from '@/components/DocumentUploadInput.vue'
import useVuelidate from '@vuelidate/core'
import ContractorDocumentsType, { DocumentName } from '@/types/contractorDocumentsTypes';
import RequestHandleLoading from '@/components/RequestHandleLoading.vue';
import RequestHandleError from '@/components/RequestHandleError.vue';

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
const lastDocuments = ref<Array<ContractorDocumentsType>>([])

const { findOne } = useApiV1()

const baseQueue = () => findOne<{ items: Array<ContractorDocumentsType> }>('documents', route.query.contractor as string).then((response) => {
    let documents = response.data.items
    console.log(response.data.items)

    if (documents.length > 0) {
        documents.map((document) => {
            docs_preview[document.name] = document.path
        })
    }
})

const { result } = useAsyncQueue([baseQueue])

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
        <div class="flex items-center space-x-4">
            <h2 class="mr-auto text-lg font-medium">Carga de Documentos</h2>
        </div>
        <CommonFormState consecutive="RD1" />
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
                        Documentos
                    </h3>
                    <div class="mt-6 grid grid-cols-2 gap-y-6 gap-x-4 md:grid-cols-3">
                        <DocumentUploadInput label="1. Propuesta de prestación de servicios" name="doc_1"
                            v-model="form.doc_1" :validator="v$" :files="files" @removefile="() => form.doc_1 = ''"
                            accept_pdf :to_edit="docs_preview.doc_1" />
                        <DocumentUploadInput label="2. Fotocopia cédula de ciudadanía al 150%" name="doc_2"
                            v-model="form.doc_2" :validator="v$" :files="files" @removefile="() => form.doc_2 = ''"
                            accept_pdf :to_edit="docs_preview.doc_2" />
                        <DocumentUploadInput label="3. Fotocopia libreta militar al 150%" name="doc_3"
                            tooltip="No aplica para mujeres" v-model="form.doc_3" :validator="v$" :files="files"
                            @removefile="() => form.doc_3 = ''" accept_pdf :to_edit="docs_preview.doc_3" />
                        <DocumentUploadInput label="4. Formato único hoja de vida" name="doc_4" v-model="form.doc_4"
                            :validator="v$" :files="files" @removefile="() => form.doc_4 = ''" accept_pdf
                            :to_edit="docs_preview.doc_4" />
                        <DocumentUploadInput label="5. Soportes educativos" name="doc_5" v-model="form.doc_5"
                            :validator="v$" :files="files" @removefile="() => form.doc_5 = ''" accept_pdf
                            :to_edit="docs_preview.doc_5" />
                        <DocumentUploadInput label="6. Fotocopia de la tarjeta profesional" name="doc_6"
                            v-model="form.doc_6" :validator="v$" :files="files" @removefile="() => form.doc_6 = ''"
                            accept_pdf :to_edit="docs_preview.doc_6" />
                        <DocumentUploadInput label="7. Certificado de vigencia de la tarjeta profesional" name="doc_7"
                            v-model="form.doc_7" :validator="v$" :files="files" @removefile="() => form.doc_7 = ''"
                            accept_pdf :to_edit="docs_preview.doc_7" />
                        <DocumentUploadInput label="8. Certificado de antecedentes de la tarjeta profesional"
                            name="doc_8" v-model="form.doc_8" :validator="v$" :files="files"
                            @removefile="() => form.doc_8 = ''" accept_pdf :to_edit="docs_preview.doc_8" />
                        <DocumentUploadInput label="9. Certificado laborales" name="doc_9" v-model="form.doc_9"
                            :validator="v$" :files="files" @removefile="() => form.doc_9 = ''" accept_pdf
                            :to_edit="docs_preview.doc_9" />
                        <DocumentUploadInput label="10. Antecedentes penales(Policía Nacional)" name="doc_10"
                            v-model="form.doc_10" :validator="v$" :files="files" @removefile="() => form.doc_10 = ''"
                            accept_pdf :to_edit="docs_preview.doc_10" />
                        <DocumentUploadInput label="11. Antecedentes disciplinarios (Procuraría general)" name="doc_11"
                            v-model="form.doc_11" :validator="v$" :files="files" @removefile="() => form.doc_11 = ''"
                            accept_pdf :to_edit="docs_preview.doc_11" />
                        <DocumentUploadInput label="12. Antecedentes fiscales (Contraloría general)" name="doc_12"
                            v-model="form.doc_12" :validator="v$" :files="files" @removefile="() => form.doc_12 = ''"
                            accept_pdf :to_edit="docs_preview.doc_12" />
                        <DocumentUploadInput label="13. Sistema de registro nacional de medidas correctivas"
                            name="doc_13" v-model="form.doc_13" :validator="v$" :files="files"
                            @removefile="() => form.doc_13 = ''" accept_pdf :to_edit="docs_preview.doc_13" />
                        <DocumentUploadInput label="14. Consulta inhabilidades (Policía nacional - ley 1918 de 2018)"
                            name="doc_14" v-model="form.doc_14" :validator="v$" :files="files"
                            @removefile="() => form.doc_14 = ''" accept_pdf :to_edit="docs_preview.doc_14" />
                        <DocumentUploadInput
                            label="15. Verificación De afiliación y/o pago de aportes al sistema de seguridad social"
                            name="doc_15" v-model="form.doc_15" :validator="v$" :files="files"
                            @removefile="() => form.doc_15 = ''" accept_pdf :to_edit="docs_preview.doc_15" />
                        <DocumentUploadInput label="15.1 Certificado de afiliación a la EPS" name="doc_15_1"
                            v-model="form.doc_15_1" :validator="v$" :files="files"
                            @removefile="() => form.doc_15_1 = ''" accept_pdf :to_edit="docs_preview.doc_15_1" />
                        <DocumentUploadInput label="15.2 Certificado de afiliación a pensión" name="doc_15_2"
                            v-model="form.doc_15_2" :validator="v$" :files="files"
                            @removefile="() => form.doc_15_2 = ''" accept_pdf :to_edit="docs_preview.doc_15_2" />
                        <DocumentUploadInput label="15.3 Planilla pagada de seguridad social" name="doc_15_3"
                            v-model="form.doc_15_3" :validator="v$" :files="files"
                            @removefile="() => form.doc_15_3 = ''" accept_pdf :to_edit="docs_preview.doc_15_3" />
                        <DocumentUploadInput label="16. Registros único tributario (RUT)" name="doc_16"
                            v-model="form.doc_16" :validator="v$" :files="files" @removefile="() => form.doc_16 = ''"
                            accept_pdf :to_edit="docs_preview.doc_16" />
                        <DocumentUploadInput label="17. Exámenes medico ocupacional" name="doc_17" v-model="form.doc_17"
                            :validator="v$" :files="files" @removefile="() => form.doc_17 = ''" accept_pdf
                            :to_edit="docs_preview.doc_17" />
                        <DocumentUploadInput label="18. Certificado cuenta bancaria" name="doc_18" v-model="form.doc_18"
                            :validator="v$" :files="files" @removefile="() => form.doc_18 = ''" accept_pdf
                            :to_edit="docs_preview.doc_18" />
                    </div>
                </div>
                <div class="pt-5">
                    <div class="flex justify-end gap-x-4">
                        <Button type="button" variant="primary" @click="$router.go(-1)">
                            Listo
                        </Button>
                    </div>
                </div>
            </form>
        </template>
    </div>
</template>