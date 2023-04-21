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

// [TypeScript] => Defining Props
interface Props {
    name: string
    disabled?: boolean
    label?: string
    tooltip?: string
    modelValue?: string | number | Object | boolean
    url?: string
    files?: any
    acceptedFiles?: string
    acceptMultiple?: boolean
    validator?: Validation
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    acceptMultiple: false,
    acceptedFiles: 'image/jpeg, image/png, image/jpg'
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
        <template v-if="label">
            <FormLabel :for="name" class="flex flex-col w-full sm:flex-row">
                {{ label }}
            </FormLabel>
        </template>
        <div class="grid grid-cols-1 gap-2 grid-rows-1">
            <fieldset :disabled="disabled">
                <file-pond :name="name" :files="files" :accepted-file-types="acceptedFiles" :allow-multiple="acceptMultiple" v-bind="$attrs" />
            </fieldset>
        </div>
        <div class="flex flex-row gap-2 items-center">
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