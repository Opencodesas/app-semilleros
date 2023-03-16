<script setup lang="ts">
import { Tab } from '@/base-components/Headless';
import Lucide from '@/base-components/Lucide'
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue';

interface Props {
    modelValue?: string | boolean | number
    name: string
}

const props = defineProps<Props>()

interface Emits {
    (e: 'update:modelValue', value: string): void
}

const emit = defineEmits<Emits>()

const value = computed({
    get() {
        return props.modelValue as any
    },
    set(value) {
        emit('update:modelValue', value)
    }
})

</script>

<template>
    <!-- <div class="grid grid-cols-2 gap-1 p-1 mx-auto mb-8 border border-dashed rounded-md w-60 border-slate-300">
    </div> -->
    <RadioGroup v-model="value">
        <div class="grid grid-cols-3 gap-1 p-1 mx-auto border border-dashed rounded-md w-full border-slate-300">
            <RadioGroupOption as="template" :value="4" v-slot="{ active, checked }">
                <div
                    :class="[checked ? 'bg-danger border-transparent text-white' : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50', 'border rounded-md p-2 flex items-center justify-center text-xs font-medium uppercase sm:flex-1 cursor-pointer']">
                    <RadioGroupLabel as="span">
                        Rechazado
                    </RadioGroupLabel>
                </div>
            </RadioGroupOption>
            <RadioGroupOption as="template" :value="3" v-slot="{ active, checked }">
                <div
                    :class="[checked ? 'bg-blue-500 text-white border-transparent' : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50', 'border rounded-md p-2 flex items-center justify-center text-xs font-medium uppercase sm:flex-1 cursor-pointer']">
                    <RadioGroupLabel as="span">
                        Ingresado
                    </RadioGroupLabel>
                </div>
            </RadioGroupOption>
            <RadioGroupOption as="template" :value="1" v-slot="{ active, checked }">
                <div
                    :class="[checked ? 'bg-success border-transparent text-white' : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50', 'border rounded-md p-2 flex items-center justify-center text-xs font-medium uppercase sm:flex-1 cursor-pointer']">
                    <RadioGroupLabel as="span">
                        Aprobado
                    </RadioGroupLabel>
                </div>
            </RadioGroupOption>
        </div>
    </RadioGroup>
    <!-- <label class="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" :name="name" value="" class="sr-only peer" v-model="value">
        <template v-if="value">
            <Lucide icon="Check" class="absolute top-1 left-0 ml-7 z-10 w-5 h-5 text-success" />
        </template>
        <template v-else>
            <Lucide icon="X" class="absolute top-1 left-0 ml-1 z-10 w-5 h-5 text-danger" />
        </template>
        <div
            class="w-[3.25rem] h-7 bg-danger peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-danger after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-success peer-checked:after:border-success">
        </div>
        <span class="ml-2 text-xs text-slate-500">
            <template v-if="value">
                Aprobado
            </template>
            <template v-else>
                Rechazado
            </template>
        </span>
    </label> -->
</template>