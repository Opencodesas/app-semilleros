<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { helpers } from '@vuelidate/validators'
import { required, nestedRequired, unique } from '@/utils/validators'
import dayjs from 'dayjs'
import Lucide from '@/base-components/Lucide'
import ScheduleFieldset from '@/components/ScheduleFieldset.vue'
import useVuelidate from '@vuelidate/core'

const form = reactive({
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
                day: '',
                start_time: '',
                end_time: '',
            }]
        }
    ]
})

const form_rules = computed(() => ({
    month: { required },
    municipality: { required },
    note: { required },
    groups: {
        $each: helpers.forEach({
            group_id: { nestedRequired, unique: unique(form.groups, 'group_id') },
            sports_modality: { nestedRequired },
            main_sports_stage_name: { nestedRequired },
            main_sports_stage_address: { nestedRequired },
            alt_sports_stage_name: { nestedRequired },
            alt_sports_stage_address: { nestedRequired },
        })
    }
}))

const groupBone = {
    group_id: '',
    sports_modality: '',
    main_sports_stage_name: '',
    main_sports_stage_address: '',
    alt_sports_stage_name: '',
    alt_sports_stage_address: '',
    schedules: [{
        day: '',
        start_time: '',
        end_time: '',
    }]
}

const scheduleBone = {
    day: '',
    start_time: '',
    end_time: '',
}

const v$ = useVuelidate(form_rules, form)

const router = useRouter()

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
    const valid = await v$.value.$validate()
    if (valid) {
        setLoading(true)
        router.push('index').finally(() => {
            setLoading(false)
        })
    }
    else {
        alerts.validation()
    }
}

const sports = [
    { label: "Futbol", value: "1" },
    { label: "Futbol sala", value: "2" },
    { label: "Baloncesto", value: "3" },
    { label: "Taekwondo", value: "4" },
]
</script>

<template>
    <div class="flex items-center mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">Creación de Cronograma</h2>
    </div>

    <div class="p-5 mt-5 intro-y box">
        <form @submit.prevent="onSubmit" class="space-y-8 divide-y divide-slate-200">
            <div class="space-y-8 divide-y divide-slate-200">
                <div>
                    <h3 class="text-lg font-medium leading-6 text-gray-900">
                        Cronograma
                    </h3>

                    <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                        <CommonSelect label="Mes del cronograma *" name="month" v-model="form.month" :validator="v$"
                            :options="months" />
                        <CommonSelect label="Municipio *" name="municipality" v-model="form.municipality"
                            :validator="v$" :options="municipalities" />
                        <div class="col-span-1 md:col-span-2">
                            <CommonEditor label="Nota" name="note" v-model="form.note" :validator="v$" />
                        </div>
                    </div>
                </div>

                <div class="pt-8">
                    <h3 class="text-lg font-medium leading-6 text-gray-900">
                        Grupos
                    </h3>

                    <div class="mt-6 divide-y divide-slate-200">
                        <ul role="list" class="divide-y divide-slate-200">
                            <template v-for="(group, index) in form.groups" :key="index">
                                <li class="px-4 py-4 sm:px-0">
                                    <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                        <CommonSelect label="Grupo *" name="group_id" v-model="group.group_id"
                                            :collection_validator="{ index, name: 'groups', v$ }" :options="groups" />

                                        <CommonSelect label="Modalidad deportiva *" name="sports_modality"
                                            v-model="group.sports_modality"
                                            :collection_validator="{ index, name: 'groups', v$ }"
                                            :options="sports.filter(({ value }) => value == group.group_id)" />

                                        <CommonInput type="text" placeholder="Ingrese"
                                            label="Escenario deportivo principal - Nombre *"
                                            name="main_sports_stage_name" v-model="group.main_sports_stage_name"
                                            :collection_validator="{ index, name: 'groups', v$ }" />

                                        <CommonInput type="text" placeholder="Ingrese"
                                            label="Escenario deportivo principal - Dirección *"
                                            name="main_sports_stage_address" v-model="group.main_sports_stage_address"
                                            :collection_validator="{ index, name: 'groups', v$ }" />

                                        <CommonInput type="text" placeholder="Ingrese"
                                            label="Escenario deportivo alternativo - Nombre *"
                                            name="alt_sports_stage_name" v-model="group.alt_sports_stage_name"
                                            :collection_validator="{ index, name: 'groups', v$ }" />

                                        <CommonInput type="text" placeholder="Ingrese"
                                            label="Escenario deportivo alternativo - Dirección *"
                                            name="alt_sports_stage_address" v-model="group.alt_sports_stage_address"
                                            :collection_validator="{ index, name: 'groups', v$ }" />

                                        <div class="col-span-1 sm:col-span-2">
                                            <Disclosure as="div" v-slot="{ open }">
                                                <dt>
                                                    <DisclosureButton
                                                        class="flex justify-between w-full px-3 py-2 rounded-md border border-slate-200 text-gray-900">
                                                        <h3 class="text-sm font-medium leading-6 text-gray-900">
                                                            Horarios
                                                        </h3>
                                                        <span class="ml-6 flex h-6 items-center">
                                                            <Lucide v-if="!open" class="h-5 w-5" icon="ChevronDown" />
                                                            <Lucide v-else class="h-5 w-5" icon="ChevronUp" />
                                                        </span>
                                                    </DisclosureButton>
                                                </dt>
                                                <DisclosurePanel as="dd" class="mt-2">
                                                    <div
                                                        class="overflow-hidden rounded-md border border-slate-200 px-4 bg-white">
                                                        <ul role="list" class="divide-y divide-slate-200">
                                                            <template v-for="(schedule, schIndex) in group.schedules"
                                                                :key="schIndex">
                                                                <ScheduleFieldset v-model:day="schedule.day"
                                                                    v-model:start_time="schedule.start_time"
                                                                    v-model:end_time="schedule.end_time" />
                                                            </template>
                                                            <li class="py-4 space-x-4">
                                                                <Button
                                                                    @click="group.schedules.push({ ...scheduleBone })"
                                                                    type="button" variant="outline-secondary">
                                                                    <Lucide icon="ListPlus" class="mr-2" />
                                                                    Agregar horario
                                                                </Button>
                                                                <Button v-if="group.schedules.length > 1"
                                                                    :disabled="group.schedules.length <= 1"
                                                                    @click="group.schedules.pop()" type="button"
                                                                    variant="outline-danger">
                                                                    <Lucide icon="ListMinus" class="mr-2" />
                                                                    Eliminar horario (ultimo)
                                                                </Button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </DisclosurePanel>
                                            </Disclosure>
                                        </div>
                                        <div v-if="index >= 1" class="col-span-1 sm:col-span-2">
                                            <Button :disabled="form.groups.length <= 1"
                                                @click="form.groups.splice(index, 1)" type="button"
                                                variant="outline-danger" size="sm">
                                                <Lucide icon="ListMinus" class="mr-2" />
                                                Eliminar grupo
                                            </Button>
                                        </div>
                                    </div>
                                </li>
                            </template>
                        </ul>
                        <div class="pt-8 text-right">
                            <Button @click="form.groups.push({ ...groupBone })" type="button" variant="outline-secondary"
                                size="sm">
                                <Lucide icon="Plus" class="mr-2" />
                                Agregar grupo
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="pt-5">
                <div class="flex justify-end gap-x-4">
                    <Button @click="$router.push({ name: 'chronograms.index' })" type="button"
                        variant="outline-secondary">
                        Cancelar
                    </Button>
                    <Button type="submit" variant="primary">
                        Guardar
                    </Button>
                </div>
            </div>
        </form>
    </div>
</template>