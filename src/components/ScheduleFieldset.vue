<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required } from '@/utils/validators'

const props = withDefaults(defineProps<{
    day?: string,
    start_time?: string,
    end_time?: string,
}>(), {
    day: '',
    start_time: '',
    end_time: ''
})

const form_rules = computed(() => ({
    day: { required },
    start_time: { required },
    end_time: { required },
}))

const emit = defineEmits(['update:day', 'update:start_time', 'update:end_time'])

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

const v$ = useVuelidate(form_rules, props, { $scope: true })
</script>

<template>
    <li class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3 py-4">
        <CommonInput type="text" placeholder="Ingrese" label="Día *" name="day" v-model="day" :validator="v$" />
        <CommonInput type="time" label="Hora inicio *" name="start_time" v-model="start_time" :validator="v$" />
        <CommonInput type="time" label="Hora final *" name="end_time" v-model="end_time" :validator="v$" />
    </li>
</template>