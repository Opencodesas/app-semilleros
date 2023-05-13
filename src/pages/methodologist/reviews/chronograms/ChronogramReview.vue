<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { helpers, requiredIf } from '@vuelidate/validators'
import { required, nestedRequired, unique } from '@/utils/validators'
import dayjs from 'dayjs'
import Lucide from '@/base-components/Lucide'
import ScheduleFieldset from '@/components/ScheduleFieldset.vue'
import useVuelidate from '@vuelidate/core'
import { chronogramServices } from "@/services/chronogramService";
import { selectOption } from '@/components/CommonSelect.vue'

const props = defineProps<{
    closeModal: Function;
    item: any;
}>();

const form = reactive({
    status_id: '',
    month: '',
    municipality: '',
    note: '',
    groups: [
        {
            group_id: '',
            sports_modality: '',
            main_sports_stage_name: '',
            main_sports_stage_address: '',
            alt_sports_stage_name: '',
            alt_sports_stage_address: '',
            schedules: [{
                idx: new Date().getTime(),
                day: '',
                start_time: '',
                end_time: '',
            }]
        }
    ],
    rejection_message: '',
    created_by: '',
})



const form_rules = computed(() => ({
    status_id: { required },
    rejection_message: { required: requiredIf(() => form.status_id == '4') },
}));

const scheduleBone = {
    idx: 0,
    day: '',
    start_time: '',
    end_time: '',
}

const groupBone = {
    group_id: '',
    sports_modality: '',
    main_sports_stage_name: '',
    main_sports_stage_address: '',
    alt_sports_stage_name: '',
    alt_sports_stage_address: '',
    schedules: [{ ...scheduleBone }]
}

const v$ = useVuelidate(form_rules, form)

const status_idList = ref<selectOption[]>([
    { label: 'Aprobado', value: '1' },
    { label: 'Rechazado', value: '4' }
])

const months = computedAsync(async () => {
    const data = await getSelect(['months'])

    const [day, month, year] = dayjs().format('DD/MM/YYYY').split('/')

    return data.slice(Number(month) - 1)
}, null)

const municipalities = computedAsync(async () => {
    return await getCitiesByDepartment('30')
}, null)

const groups = computedAsync(async () => {
    return await getSelect(['groups'])
}, null)

const onSubmit = async () => {
    const valid = true //await v$.value.$validate()
    if (valid) {
        await chronogramServices.update(props.item.id as string, formdataParser(form))
            .then((res: any) => {
                if (res) {
                    alerts.update();
                    setLoading(false)

                }

            });
    }
    else {
        alerts.validation()
    }
}

const dataLoaded = ref(false)

const fetch = async () => {
    console.log(props.item)
    form.month = props.item.month
    form.municipality = props.item.municipio
    form.note = props.item.note
    form.groups = props.item.groups
}

onBeforeMount(async () => {
    fetch();
    dataLoaded.value = true;
})


const sports = [
    { label: "Futbol", value: "1" },
    { label: "Futbol sala", value: "2" },
    { label: "Baloncesto", value: "3" },
    { label: "Taekwondo", value: "4" },
]

watch(() => form.status_id, () => {
    if (form.status_id == '1') form.rejection_message = '';
})
</script>

<template>
    <div class="flex items-center justify-between mt-5 mb-2 intro-y">
        <h1 class="mr-auto text-lg font-medium">Revisar cronograma</h1>
    </div>

    <div class="space-y-2 box px-5 py-4">
        <h2 class="font-bold">Revisión</h2>
        <CommonSelect label="Estado de la tarea *" name="status_id" v-model="form.status_id" :validator="v$"
            :options="status_idList" />
        <div v-if="form.status_id == '4'" class="pt-4">
            <CommonTextarea name="rejection_message" class="" label="Comentario *" placeholder="Escriba..." rows="5"
                v-model="form.rejection_message" :validator="v$" />
        </div>
        <div class="mt-6 flex justify-end col-span-1 md:col-span-2 border-none gap-1" tabindex="1">
            <Button variant="danger" @click="props.closeModal">Cerrar</Button>
            <Button variant="primary" class="btn btn-primary" @click="onSubmit">
                Enviar
            </Button>
        </div>
    </div>

    <div v-if="dataLoaded" class="p-5 pt-3 mt-5 intro-y box">
        <div class="mb-4">
            <h3><span class="font-bold">Monitor:</span> {{ form.created_by }}</h3>
        </div>
        <form @submit.prevent="onSubmit" class="space-y-8 divide-y divide-slate-200">
            <div class="space-y-8 divide-y divide-slate-200">
                <div>
                    <h3 class="text-lg font-medium leading-6 text-gray-900">
                        Cronograma
                    </h3>

                    <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                        <CommonInput label="Mes del cronograma *" name="month" v-model="form.month" disabled />
                        <CommonInput label="Municipio *" name="municipality" v-model="form.municipality" disabled />
                        <div class="col-span-1 md:col-span-2">
                            <CommonEditor label="observaciones" name="note" v-model="form.note" disabled />
                        </div>
                    </div>
                </div>

                <div class="pt-8">
                    <h3 class="text-lg font-medium leading-6 text-gray-900">
                        Grupos
                    </h3>

                    <div class="mt-6 divide-y divide-slate-200">
                        <ul role="list" class="divide-y">
                            <template v-for="(group, index) in form.groups" :key="index">
                                <li class="box border border-slate-200 px-4 py-4 sm:p-4 mb-3">
                                    <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                        <CommonSelect label="Grupo *" name="group_id" v-model="group.group_id"
                                            :allowEmpty="false" :options="groups" disabled />

                                        <CommonSelect label="Modalidad deportiva *" name="sports_modality"
                                            :allowEmpty="false" v-model="group.sports_modality"
                                            :options="sports.filter(({ value }) => value == group.group_id)" disabled />

                                        <CommonInput type="text" placeholder="Ingrese"
                                            label="Escenario deportivo principal - Nombre *" name="main_sports_stage_name"
                                            v-model="group.main_sports_stage_name" disabled />

                                        <CommonInput type="text" placeholder="Ingrese"
                                            label="Escenario deportivo principal - Dirección *"
                                            name="main_sports_stage_address" v-model="group.main_sports_stage_address"
                                            disabled />

                                        <CommonInput type="text" placeholder="Ingrese"
                                            label="Escenario deportivo alternativo - Nombre *" name="alt_sports_stage_name"
                                            v-model="group.alt_sports_stage_name" disabled />

                                        <CommonInput type="text" placeholder="Ingrese"
                                            label="Escenario deportivo alternativo - Dirección *"
                                            name="alt_sports_stage_address" v-model="group.alt_sports_stage_address"
                                            disabled />

                                        <div class="col-span-1 sm:col-span-2">

                                            <h3 class="text-sm font-medium leading-6 text-gray-900">
                                                Horarios
                                            </h3>

                                            <div class="rounded-md border border-slate-200 px-4 bg-white">
                                                <ul role="list" class="divide-y divide-slate-200">
                                                    <template v-for="(schedule, schIndex) in group.schedules"
                                                        :key="schIndex">
                                                        <li
                                                            class="grid grid-flow-dense grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-[4fr_4fr_4fr_1fr] py-4">
                                                            <CommonInput label="Día *" name="day" v-model="schedule.day"
                                                                disabled />
                                                            <CommonInput type="time" label="Hora inicio *" id="start_time"
                                                                name="start_time" v-model="schedule.start_time" disabled />
                                                            <CommonInput type="time" label="Hora final *" id="end_time"
                                                                name="end_time" v-model="schedule.end_time" disabled />
                                                            <input type="hidden" name="idx" v-model="schedule.idx" />
                                                        </li>
                                                    </template>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </template>
                        </ul>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>