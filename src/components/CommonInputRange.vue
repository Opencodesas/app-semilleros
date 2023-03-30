<template>
    <div class="range-input">
        <input type="range" v-model="value" :min="min" :max="max" @input="onInput" />
        <div class="tooltip range-input" >{{ value }}</div>
    </div>
</template>
  
<script lang="ts">
import { PropType, defineEmits } from 'vue';
export default defineComponent({
    name: "RangeInput",
    props: {
        min: {
            type: Number,
            required: true,
        },
        max: {
            type: Number,
            required: true,
        },
        value: {
            type: Number as PropType<number>,
            required: true,
        },
    },
    emits: defineEmits<{ 'update:value': (value: number) => void }>(),

    setup(props, { emit }) {
        const tooltipLeft = ref(0);

        const onInput = (event: Event) => {
            const target = event.target as HTMLInputElement;
            emit("update:value", Number(target.value));
        };

        const rangeStyle = computed(() => {
            const percent = ((props.value - props.min) / (props.max - props.min)) * 100;
            return `background: linear-gradient(to right, #374151 0%, #374151 ${percent}%, #D1D5DB ${percent}%, #D1D5DB 100%)`;
        });

        const updateTooltipLeft = () => {
            const range = document.querySelector(".range-input input[type=range]") as HTMLElement;
            const tooltip = document.querySelector(".range-input .tooltip") as HTMLElement;

            const rangeRect = range.getBoundingClientRect();
            const rangeWidth = range.offsetWidth;
            const tooltipWidth = tooltip.offsetWidth;

            const percent = ((props.value - props.min) / (props.max - props.min)) * 100;
            const tooltipLeft = percent * rangeWidth / 100 - tooltipWidth / 2 + rangeRect.left;

            tooltipLeft >= rangeRect.left && tooltipLeft + tooltipWidth <= rangeRect.right
                ? (tooltip.style.left = `${tooltipLeft}px`)
                : (tooltip.style.left = tooltipLeft < rangeRect.left ? `${rangeRect.left}px` : `${rangeRect.right - tooltipWidth}px`);
        };

        onMounted(() => {
            window.addEventListener("resize", updateTooltipLeft);
        });

        return {
            tooltipLeft,
            onInput,
            rangeStyle,
            updateTooltipLeft,
        };
    },
    watch: {
        value() {
            this.updateTooltipLeft();
        },
    },
});
</script>
  
<style>
.range-input {
    position: relative;
}

.range-input .tooltip {
    position: absolute;
    top: -30px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #374151;
    color: white;
    font-weight: bold;
}
</style>
  