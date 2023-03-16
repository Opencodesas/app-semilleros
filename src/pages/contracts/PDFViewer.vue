<script setup lang="ts">
import Button from '@/base-components/Button';
import Lucide from '@/base-components/Lucide';
import ClausesManagement from '@/components/ClausesManagement.vue'
import VuePdfEmbed from 'vue-pdf-embed'

const loading = ref(true)
const pageCount = ref(1)
const pdfRef = ref()
const route = useRoute()

const page = ref<number | undefined | any>(1)
const pdfSource = ref<string | Uint8Array>('')
const showAllPages = ref(true)

const { create } = useApiV1()

const baseQueue = () => create('exports/pdf/contract', formdataParser({ id: route.query.id }), {
    responseType: 'blob'
}).then((response) => {
    const reader = new FileReader()

    reader.readAsArrayBuffer(new Blob([response.data as unknown as BlobPart]))

    reader.onloadend = () => {
        pdfSource.value = new Uint8Array(reader.result as ArrayBuffer)
    }
})

const { result } = useAsyncQueue([baseQueue])

function handleDocumentRender(args: any) {
    console.log(args)
    loading.value = false
    pageCount.value = pdfRef.value.pageCount
}

watch(showAllPages, () => {
    page.value = showAllPages.value ? null : 1
})
</script>

<template>
    <div class="flex items-center justify-between mt-8 intro-y">
        <div class="flex items-center">
            <Button variant="outline-secondary" @click="$router.go(-1)">
                <Lucide icon="ChevronLeft" />
                <span class="ml-2">
                    Volver
                </span>
            </Button>
            <h2 class="ml-4 text-lg font-medium">Visor de Contrato</h2>
        </div>
    </div>
    <div class="intro-y box p-5 mt-5">
        <template v-if="result[0].state == 'pending'">
            <RequestHandleLoading />
        </template>
        <template v-else-if="result[0].state == 'rejected'">
            <RequestHandleError />
        </template>
        <template v-else-if="result[0].state == 'fulfilled'">
            <template v-if="pdfSource">
                <div class="flex flex-col gap-2">
                    <div class="flex justify-center">
                        <div class="pl-4 flex items-center space-x-2">
                            <Button @click="page--" :disabled="page <= 1" variant="outline-secondary" size="sm" rounded>
                                <Lucide icon="ChevronLeft" class="w-5 h-5" />
                            </Button>
                            <div class="w-12 h-8 flex justify-center items-center rounded-full bg-slate-100">
                                {{ page }} / {{ pageCount }}
                            </div>
                            <Button @click="page++" :disabled="page == pageCount" variant="outline-secondary" size="sm"
                                rounded>
                                <Lucide icon="ChevronRight" class="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                    <!-- <div class="mx-24"> -->
                        <VuePdfEmbed ref="pdfRef" :source="pdfSource" :page="page" @rendered="handleDocumentRender" />
                    <!-- </div> -->
                </div>
            </template>
        </template>
    </div>
</template>

<!-- <script setup lang="ts">
import RequestHandleError from '@/components/RequestHandleError.vue';
import RequestHandleLoading from '@/components/RequestHandleLoading.vue';
import { VuePdf, createLoadingTask } from 'vue3-pdfjs'

const route = useRoute()
const pdfSrc = ref<Uint8Array>()
const numOfPages = ref(0)
const page = ref(1)

const { create } = useApiV1()

const baseQueue = () => create('exports/pdf/contract', formdataParser({ id: route.query.id }), {
    responseType: 'blob'
}).then((response) => {
    const reader = new FileReader()

    reader.readAsArrayBuffer(new Blob([response.data as unknown as BlobPart]))

    reader.onloadend = () => {
        pdfSrc.value = new Uint8Array(reader.result as ArrayBuffer)

        const loadingTask = createLoadingTask(new Uint8Array(reader.result as ArrayBuffer))

        loadingTask.promise.then((pdf) => {
            numOfPages.value = pdf.numPages
        })
    }
})

const { result } = useAsyncQueue([baseQueue])
</script>

<template>
    <div :class="[
        'max-w-full md:max-w-none rounded-[30px] md:rounded-none p-5 md:px-[22px] my-5 min-w-0 min-h-screen bg-slate-100 flex-1 relative',
        'before:content-[\'\'] before:w-full before:h-px before:block',
    ]">
        <div class="intro-y box p-5 rounded-md">
            <template v-if="result[0].state == 'pending'">
                <RequestHandleLoading />
            </template>
            <template v-else-if="result[0].state == 'rejected'">
                <RequestHandleError />
            </template>
            <template v-else-if="result[0].state == 'fulfilled'">
                <template v-if="pdfSrc">
                    <div class="mx-12">
                        <VuePdf :key="page" :src="pdfSrc" :page="page" />
                    </div>
                </template>
            </template>
        </div>
    </div>
</template> -->