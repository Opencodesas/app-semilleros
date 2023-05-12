<script setup lang="ts">
import VueMultiSelect from 'vue-multiselect'
import { Validation } from '@vuelidate/core'

export interface selectOption {
    [key: string]: any
    label: string | number
    value: string | number | boolean
}

// [TypeScript] => Defining Props
interface Props {
    index: number
    groupsList: Function
    required?: boolean,
    modelValue?: string | number
    label?: string
    placeholder?: string
    multiple?: boolean
    disabled?: boolean
    tooltip?: string
    onRemove?: Function
    onSelect?: Function
    name: string
    allowEmpty: boolean,
    options: selectOption[] | null
    setSort?: boolean,
    validator?: Validation,
    collection_validator?: {
        index: number
        name: string
        v$: Validation
    }
}

const props = withDefaults(defineProps<Props>(), {
    multiple: false,
    allowEmpty: true,
    setSort: true,
    placeholder: 'Seleccione una opción...'
})


const noOpt = ['Sin Opción']

const options_handle = computed(() => {
    if (value){
        return props.groupsList(value);
    }
})


// [TypeScript] => Defining Emits
interface Emits {
    (e: 'update:modelValue', value: string): void
}

const emit = defineEmits<Emits>()

// Detecting v-model changes.
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
    <CommonSelect :label="props.label" :name="props.name" v-model="value" :allowEmpty="false"
        :collection_validator="props.collection_validator" :options="options_handle" />
</template>