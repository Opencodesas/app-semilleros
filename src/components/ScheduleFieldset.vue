<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required } from '@/utils/validators'

const days = [
    { label: 'Lunes', value: 'Lunes'}, 
    { label: 'Martes', value: 'Martes'}, 
    { label: 'Miércoles', value: 'Miércoles'}, 
    { label: 'Jueves', value: 'Jueves'}, 
    { label: 'Viernes', value: 'Viernes'}, 
    { label: 'Sábado', value: 'Sábado'}, 
    { label: 'Domingo', value: 'Domingo'}
];

const props = withDefaults(defineProps<{
    idx?: number,
    day?: string,
    start_time?: string,
    end_time?: string,
    item?: number
}>(), {
    idx: new Date().getTime(),
    day: '',
    start_time: '',
    end_time: '',
    item: 0
})

const form_rules = computed(() => ({
    day: { required },
    start_time: { required },
    end_time: { required },
}))

const emit = defineEmits(['update:idx', 'update:day', 'update:start_time', 'update:end_time'])

const day = computed({
    get(){
        return props.day
    },
    set(value){
        emit('update:day', value)
    }
})

const start_time = computed({
    get(){
        return props.start_time
    },
    set(value){
        emit('update:start_time', value)
    }
})

const end_time = computed({
    get(){
        return props.end_time
    },
    set(value){
        emit('update:end_time', value)
    }
})

const minTime = computed({
    get(){
        const split = start_time.value.split(':')
        const start = Number(split[0]);
        return start + 2 > 24 ? `0${start - 22}:${split[1]}` : `${start + 2}:${split[1]}`
    }, 
    set(value){
    }
})

const v$ = useVuelidate(form_rules, props, { $scope: true })
</script>

<template>
    <li class="grid grid-flow-dense grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-[4fr_4fr_4fr_1fr] py-4">
        <CommonSelect :allowEmpty="false" :options="days" :setSort="false" label="Día *" name="day" v-model="day" :validator="v$" />
        <CommonInput  :required="true" type="time" label="Hora inicio *" name="start_time" v-model="start_time" :validator="v$" />
        <CommonInput  :required="true" type="time" label="Hora final *" :min="minTime" name="end_time" v-model="end_time" :validator="v$" />
        <button v-if="props.item > 0"  title="Remover" type="button">
            <Lucide icon="ListMinus" class="self-center mt-5 text-danger" role="button" @click="$emit( 'removeChild', props.item )" />
        </button>
        <input type="hidden" name="idx" v-model="props.idx" />
    </li>
</template>