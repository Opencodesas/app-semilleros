<script lang="ts" setup>
import { FormInput } from '@/base-components/Form';
import { Validation } from '@vuelidate/core'

// [TypeScript] => Defining Props
interface Props {
    type?:
    | 'text'
    | 'number'
    | 'email'
    | 'password'
    | 'search'
    | 'url'
    | 'tel'
    | 'date'
    | 'time'
    | 'range'
    | 'color'
    | 'hidden'
    | 'file'
    required? : boolean,
    modelValue?: string | number | Object | boolean
    label?: string
    step?: string,
    placeholder?: string
    min?: string | number
    max?: string | number
    tooltip?: string
    tooltip_left?: string
    disabled?: boolean
    name: string
    validator?: Validation
    collection_validator?: {
        index: number
        name: string
        v$: Validation
    }
}

const props = withDefaults(defineProps<Props>(), {
    type: 'text',
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

<script lang="ts">
export default {
    inheritAttrs: false,
}
</script>

<template>
    <div class="input-form">
        <!-- Label -->
        <template v-if="label">
            <FormLabel :for="name" class="flex flex-col w-full sm:flex-row">
                {{ label }}
            </FormLabel>
        </template>
        <!-- If is Date -->
        <!-- <div v-if="type === 'date'"
            class="absolute right-0 box-border rounded-r w-10 h-[42px] pointer-events-none flex items-center justify-center bg-slate-100 border text-slate-500"
            :class="[checkInputValidity, label ? 'top-7' : 'top-0']">
            <CalendarIcon class="w-4 h-4" />
        </div> -->
        <!-- Component -->
        <FormInput :id="name" :class="[{
            'border-danger': validator && validator[name].$error
                || collection_validator && (props.collection_validator?.v$[props.collection_validator?.name].$each.$response.$errors[props.collection_validator?.index][props.name].length && collection_validator.v$[collection_validator.name].$error)
        }, { 'block px-4 py-3 intro-x login__input min-w-full xl:min-w-[350px]': $route.name == 'login' }]"
            :max="max"
            :step="step"
            :placeholder="placeholder"
            :onfocus="
                (type == 'time' || type == 'date')
                    ? 'this.showPicker()' : '' "
            v-model="value"
            v-bind="props"
            @change="$emit('change', $event)"
        />
        <!-- Validator -->
        <div class="flex flex-row justify-between">
            <template v-if="tooltip">
                <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    {{ tooltip }}
                </span>
            </template>
            <template v-else-if="tooltip_left">
                <span class="mt-1 text-xs sm:mt-2 text-slate-500">
                    {{ tooltip_left }}
                </span>
            </template>
            <template v-else-if="validator">
                <template v-if="validator[name].$error">
                    <div v-for="(error, index) in validator[name].$errors" :key="index"
                        class="mt-1 text-xs text-danger">
                        {{ error.$message }}
                    </div>
                </template>
            </template>
            <template v-else-if="collection_validator">
                <template v-if="collection_validator.v$[collection_validator.name].$error">
                    <div v-for="(error, index) in collection_validator.v$[collection_validator.name].$each.$response.$errors[collection_validator.index][name]"
                        :key="index" class="mt-1 text-xs text-danger">
                        {{ error.$message }}
                    </div>
                </template>
            </template>
        </div>
    </div>
</template>

<!-- <style scoped>
.BaseInput {}
</style> -->
