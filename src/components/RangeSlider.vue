<script setup lang="ts">
import { FormInput } from '@/base-components/Form';
import { Validation } from '@vuelidate/core'

interface RangeSliderProps {
    modelValue?: string | number
    label?: string
    min?: number
    max?: number
    disabled?: boolean
    name: string
    validator?: Validation
    collection_validator?: {
         index: number
         name: string
         v$: Validation
     }
}

const props = withDefaults(defineProps<RangeSliderProps>(), {
    modelValue: 0, // Valor predeterminado
    min: 0,
    max: 100,
    name: ''
})

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

const isTooltipActive = ref(false);

const tooltipPosition = ref('');

const position = computed(() => {
    if (typeof props.modelValue !== 'number' || typeof props.min !== 'number' || typeof props.max !== 'number') {
    return '';
  }

  const positionTooltip = (props.modelValue - props.min) / (props.max - props.min);
  tooltipPosition.value = `calc(${positionTooltip * 100}% - 10px)`;
});

</script>

<script lang="ts">
export default {
    inheritAttrs: false,
}
</script>

<template>
    <div class="range-slider">
        <input type="range" :min="min" :max="max" @mouseover="isTooltipActive = true" @mouseout="isTooltipActive = false" v-model="value" />
        <div :style="{ left: tooltipPosition }" class="tooltip" v-if="isTooltipActive">{{ modelValue }}</div>
    </div>
</template>
  
<style>
.range-slider {
    position: relative;
}

.tooltip {
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #fff;
    border: 1px solid #ccc;
    padding: 5px;
    border-radius: 5px;
}
</style>
  