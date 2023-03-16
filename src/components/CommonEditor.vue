<script setup lang="ts">
import { FormLabel } from '@/base-components/Form';
import { Validation } from '@vuelidate/core'
import TipTap from './TipTap.vue';

interface Props {
    modelValue?: string
    label?: string
    tooltip?: string
    disabled?: boolean
    name: string
    validator: Validation
}

const props = withDefaults(defineProps<Props>(), {})

interface Emits {
    (e: 'update:modelValue', value: string): void
}

const emit = defineEmits<Emits>()

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
        <div :class="[{ 'border-danger border': validator && validator[name].$error }, 'rounded-md w-full min-w-full overflow-y-auto']">
            <TipTap v-model="value" :disabled="disabled" />
        </div>
        <template v-if="tooltip">
            <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                {{ tooltip }}
            </span>
        </template>
        <template v-else-if="validator">
            <template v-if="validator[name].$error">
                <div v-for="(error, index) in validator[name].$errors" :key="index" class="mt-1 text-xs text-danger">
                    {{ error.$message }}
                </div>
            </template>
        </template>
    </div>
</template>