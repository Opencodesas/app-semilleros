<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { helpers } from '@vuelidate/validators'
import { required, nestedRequired, unique } from '@/utils/validators'
import dayjs from 'dayjs'
import Lucide from '@/base-components/Lucide'
import ScheduleFieldset from '@/components/ScheduleFieldset.vue'
import useVuelidate from '@vuelidate/core'
import {chronogramServices} from "@/services/chronogramService";

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
                idx: new Date().getTime(),
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
        idx: new Date().getTime(),
        day: '',
        start_time: '',
        end_time: '',
    }]
}

const scheduleBone = {
    idx: 0,
    day: '',
    start_time: '',
    end_time: '',
}

const v$ = useVuelidate(form_rules, form)

const router = useRouter()
const route  = useRoute()

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
    const hayCruce = checkChronogram();
    const valid = await v$.value.$validate()
    if (valid) {
        if ( !hayCruce ) {

            await chronogramServices.update( route.params.id as string, formdataParser(form) )
            .then((res: any) => {
                if(res){
                    alerts.update();
                    router.push('/dashboard/chronograms')
                    .finally(() => {
                        setLoading(false)
                    })
                }

            });
        } else {
            alerts.custom('Validación', 'Por favor verifique los horarios cruzados.', 'error')
        }
    }
    else {
        alerts.validation()
    }
}

const fetch = async () => {
    await chronogramServices.get(route.params.id as string)
    .then((response) => {
        if (response?.status == 200 || response?.status == 201) {
            form.month = response.data.items.month;
            form.municipality = response.data.items.municipality;
            form.note = response.data.items.note;
            form.groups = response.data.items.groups;
            // form.gender = response.data.items.gender;
            // form.phone = response.data.items.phone;
            // form.document_type = response.data.items.document_type;
            // form.document_number = response.data.items.document_number;
            // form.roles = response.data.items.roles[0];
            alerts.custom('', response?.data.message, 'info');
        } else {
            alerts.custom("", "No se pudieron obtener los datos", "error");
        }
        console.log(form);
    });
}

onBeforeMount(async () => {
    await fetch();
})

const checkChronogram = () => {
    
    let hayCruce = false; 

    for( let i = 0; i < form.groups.length; i++) {
        const schedules = form.groups[i].schedules;

        for( let j = 0; j <= schedules.length; j++ ) {
            const horario = schedules[j];
            if ( !horario ) continue

            hayCruce = searchItem( schedules, horario );

            if(hayCruce) break;
        }

        if(hayCruce) break;
    }

    return hayCruce
}

const searchItem = ( schedules: any, horario: any ) => {
    let hayCruce = false; 

    for( let i = 0; i < form.groups.length; i++) {
        const filterSameDay = schedules.filter( (item: any) => item.idx !== horario.idx && item.day === horario.day);
        
        filterSameDay.forEach( (item: any) => {
            if( 
                (item.start_time <= horario.start_time && item.end_time <= horario.end_time && item.end_time > horario.start_time) ||
                (item.start_time >= horario.start_time && item.end_time >= horario.end_time && item.start_time < horario.end_time) ||
                (item.start_time >= horario.start_time && item.end_time <= horario.end_time) ||
                (item.start_time <= horario.start_time && item.end_time >= horario.end_time) ||
                (item.start_time == horario.start_time && item.end_time == horario.end_time)
            ) {
                hayCruce = true;
                return;
            }
        })

        if ( hayCruce ){
            break;
        }
    }

    return hayCruce;
}

const onAddGrupo = () => {
    if ( form.groups.length < 4 ) {
        form.groups.push({ ...groupBone })
    }
}

const removeChild = (pos: number, group: any) => {
    group.schedules.splice( pos, 1 )
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
                            :options="months" :allowEmpty="false"
                        />
                        <CommonSelect label="Municipio *" name="municipality" v-model="form.municipality"
                            :validator="v$" :options="municipalities" :allowEmpty="false"
                        />
                        <div class="col-span-1 md:col-span-2">
                            <CommonEditor label="observaciones" name="note" v-model="form.note" :validator="v$" />
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
                                        <CommonSelect label="Grupo *" name="group_id" v-model="group.group_id" :allowEmpty="false"
                                            :collection_validator="{ index, name: 'groups', v$ }" :options="groups" />

                                        <CommonSelect label="Modalidad deportiva *" name="sports_modality" :allowEmpty="false"
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
                                                <DisclosurePanel as="dd" class="mt-1">
                                                    <div
                                                        class="rounded-md border border-slate-200 px-4 bg-white">
                                                        <ul role="list" class="divide-y divide-slate-200">
                                                            <template v-for="(schedule, schIndex) in group.schedules"
                                                                :key="schIndex">
                                                                <ScheduleFieldset 
                                                                    v-model:idx="schedule.idx"
                                                                    v-model:day="schedule.day"
                                                                    v-model:start_time="schedule.start_time"
                                                                    v-model:end_time="schedule.end_time"
                                                                    :item="schIndex"
                                                                    @removeChild="removeChild($event, group)"
                                                                />
                                                            </template>
                                                            <li class="py-4 space-x-4">
                                                                <Button
                                                                    @click="group.schedules.push({ ...scheduleBone, idx: new Date().getTime() })"
                                                                    type="button" variant="outline-primary">
                                                                    <Lucide icon="ListPlus" class="mr-2" />
                                                                    Agregar horario
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
                            <Button @click="onAddGrupo()" type="button"
                                variant="outline-primary"
                                size="sm"
                                :disabled="form.groups.length === 4"
                            >
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