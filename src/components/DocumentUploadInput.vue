<script lang="ts" setup>
// @ts-ignore => Ignore TS erros in the line below
import vueFilePond, { setOptions } from 'vue-filepond'
// @ts-ignore => Ignore TS erros in the line below
import CommonInput from './CommonInput.vue'

// [Filepond] => Import FilePond styles & mage preview plugin styles
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'

// [Filepond] => Import image preview and file type validation plugins
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import { Validation } from '@vuelidate/core'
import Lucide from '@/base-components/Lucide'

// [TypeScript] => Defining Props
interface Props {
    name: string
    disabled?: boolean
    label?: string
    tooltip?: string
    modelValue?: string | number | Object | boolean
    to_edit?: string
    accept_pdf?: boolean
    accept_pdf_only?: boolean
    accept_word?: boolean
    accept_docs?: boolean
    validator: Validation
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    accept_pdf: false,
    accept_pdf_only: false,
    accept_word: false,
    accept_docs: false
})

// [TypeScript] => Defining Emits
interface Emits {
    (e: 'update:modelValue', value: string): void
}

const emit = defineEmits<Emits>()

// [Filepond] => Creating Component
const FilePond = vueFilePond(FilePondPluginFileValidateType, FilePondPluginImagePreview)

// [Filepond] => Setting Global Options
setOptions({
    credits: false,
    imagePreviewMinHeight: '150',
    imagePreviewMaxHeight: '150',
    labelIdle: 'Arrastra el archivo aquí',
    labelInvalidField: 'Formato de archivo inválido',
    labelFileLoading: 'Cargando',
    labelFileLoadError: 'Error durante la carga',
    labelFileProcessingError: 'Error durante la carga',
    labelFileProcessingComplete: 'Carga completada',
    labelTapToUndo: 'Presione para revertir',
    labelFileProcessing: 'Subiendo',
    labelTapToRetry: 'Presiona para intentar de nuevo',
    labelTapToCancel: 'Presiona para cancelar',
    labelButtonRemoveItem: 'Eliminar',
    labelMaxFileSizeExceeded: 'El archivo es muy grande',
    labelFileTypeNotAllowed: 'Extensión del archivo inválida',
})

const accepted_files = computed(() => {
    return ['application/pdf']
})

const router = useRouter()
const route = useRoute()

const preview_edit = computed(() => {
    // return `${import.meta.env.VITE_BASE_URL}${props.to_edit}`
    if (props.to_edit)
        return (props.to_edit.includes('http')) ? props.to_edit : `${import.meta.env.VITE_BASE_URL}/storage/${props.to_edit}`
})

const openPreview = () => {
    let routeData = router.resolve({
        path: '/pdf-viewer',
        query: {
            file: props.to_edit
        }
    })

    window.open(routeData.href, '_blank', 'menubar=no')
}

const serverConfig = computed(() => ({
    url: `http://localhost:8000/api/v1/document-upload`,
    withCredentials: true,
    process: async (fieldName: string, file: Blob, metadata: any, load: Function, error: Function, progress: Function, abort: Function, _transfer: any, _options: any) => {
        const fd = new FormData()

        fd.append('doc_name', fieldName)
        fd.append('contractor_id', String(route.query.contractor))
        fd.append(fieldName, file)
        fd.append('contract_id', String(route.query.contractor))


        const controller = new AbortController()

        const res = await api.post('/api/v1/document-upload', fd, {
            signal: controller.signal,
            onUploadProgress: (e) => {
                progress(e.upload, e.loaded, e.total)
            },
        })
            .then((response) => {
                if (response.status >= 200 && response.status <= 300) {
                    emit('update:modelValue', response.data)
                    load(response.data)
                }
                else {
                    error('Oh no!')
                }
            })

        return {
            abort: () => {
                controller.abort()

                abort()
            }
        }
    },
    revert: async (uniqueFileId: any, load: any, error: any) => {
        const res = await api.delete('/api/v1/documents', {
            data: {
                path: uniqueFileId
            }
        })
            .then((res) => {
                load(res.data)
            })
            .catch((err: any) => {
                error(err)
            })
    },
    // load: async (source: Blob, load, error, progress, abort, headers) => {
    //     await api.get(`/api/v1/documents/${String(route.query.contractor)}`).then((res) => {

    //     })

    //     load()

    // }
}))

const value = computed({
    get() {
        return props.modelValue as string
    },
    set(value) {
        emit('update:modelValue', value)
    }
})
</script>

<template>
    <div class="input-form">
        <!-- Label -->
        <template v-if="label">
            <FormLabel :for="name" class="flex flex-col w-full sm:flex-row">
                {{ label }}
            </FormLabel>
        </template>
        <!-- Component -->
        <div :class="to_edit ? 'grid-cols-1 sm:grid-cols-[1fr_auto]' : 'grid-cols-1'" class="grid gap-2 grid-rows-1">
            <fieldset :disabled="disabled">
                <file-pond :name="name" :accepted-file-types="accepted_files" :server="serverConfig" v-bind="$attrs" />
            </fieldset>
            <div v-if="to_edit" class="relative intro-x flex justify-center w-full h-full rounded select-none">
                <div class="absolute z-0 bg-stripes bg-[#f1f0ef] rounded w-full h-full" />
                <div class="grid place-content-center w-full h-full px-5 relative rounded-lg z-10">
                    <Button type="button" @click="openPreview" variant="outline-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 256 256">
                            <path fill="currentColor"
                                d="M48 136a8 8 0 0 0 8-8V40h88v48a8 8 0 0 0 8 8h48v32a8 8 0 0 0 16 0V88a7.7 7.7 0 0 0-2.4-5.7l-55.9-56A8.1 8.1 0 0 0 152 24H56a16 16 0 0 0-16 16v88a8 8 0 0 0 8 8Zm112-84.7L188.7 80H160ZM64 160H48a8 8 0 0 0-8 8v48a8 8 0 0 0 16 0v-8h8a24 24 0 0 0 0-48Zm0 32h-8v-16h8a8 8 0 0 1 0 16Zm132-16v12h16a8 8 0 0 1 0 16h-16v12a8 8 0 0 1-16 0v-48a8 8 0 0 1 8-8h28a8 8 0 0 1 0 16Zm-68-16h-14a8 8 0 0 0-8 8v48a8 8 0 0 0 8 8h14a32 32 0 0 0 0-64Zm0 48h-6v-32h6a16 16 0 0 1 0 32Z" />
                        </svg>
                    </Button>
                </div>
            </div>
        </div>
        <div class="flex flex-row gap-2 items-center">
            <slot name="footer" />
            <CommonInput type="hidden" :name="name" v-model="value" :validator="validator" />
            <template v-if="tooltip">
                <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    {{ tooltip }}
                </span>
            </template>
        </div>
    </div>
</template>

<style>
.filepond--root {
    margin-bottom: 0em;
}
</style>