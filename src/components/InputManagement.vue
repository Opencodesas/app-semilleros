<script setup lang="ts">
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue';
import { Validation } from '@vuelidate/core'

const props = defineProps<{
    modelValue: any
    name: string
    validator: Validation
}>()

const emit = defineEmits(['update:modelValue'])

const value = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    }
})
</script>

<template>
    <RadioGroup v-model="value">
        <div :class="[
            validator[name].$error ? 'border-danger' : 'border-slate-300',
            'grid grid-cols-2 gap-1 p-1 mx-auto border border-dashed rounded-md w-full'
        ]">
            <RadioGroupOption as="template" :value="4" v-slot="{ checked }">
                <div
                    :class="[checked ? 'bg-danger border-transparent text-white' : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50', 'border rounded-md p-2 flex items-center justify-center text-xs font-medium uppercase sm:flex-1 cursor-pointer outline-none']">
                    <RadioGroupLabel as="span">
                        Rechazado
                    </RadioGroupLabel>
                </div>
            </RadioGroupOption>
            <RadioGroupOption as="template" :value="1" v-slot="{ checked }">
                <div
                    :class="[checked ? 'bg-success border-transparent text-white' : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50', 'border rounded-md p-2 flex items-center justify-center text-xs font-medium uppercase sm:flex-1 cursor-pointer outline-none']">
                    <RadioGroupLabel as="span">
                        Aprobado
                    </RadioGroupLabel>
                </div>
            </RadioGroupOption>
        </div>
        <template v-if="validator[name].$error">
            <div v-for="(error, index) in validator[name].$errors" :key="index" class="mt-1 text-xs text-danger">
                {{ error.$message }}
            </div>
        </template>
    </RadioGroup>
</template>