<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { helpers } from '@vuelidate/validators'
import { required, nestedRequired, unique } from '@/utils/validators'
import dayjs from 'dayjs'
import Lucide from '@/base-components/Lucide'
import ScheduleFieldset from '@/components/ScheduleFieldset.vue'
import useVuelidate from '@vuelidate/core'
import {chronogramServices} from "@/services/chronogramService";
import { onboardingStore } from '@/stores/onboardingStore'
import {organizeHolidays} from './utils/holidays'

const storeOnboarding = onboardingStore()

const dataLoaded = ref(false)
const form = reactive({
    status_id: 0,
    month: '',
    municipality: '',
    note: '',
    note_holiday: '',
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
    rejection_message: ''
})

const form_rules = computed(() => ({
    month: { required },
    municipality: { required },
    note: {},
    note_holiday: {},
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
    schedules: [ {...scheduleBone} ]
}

const v$ = useVuelidate(form_rules, form)

const router = useRouter()
const route = useRoute()



const months = computedAsync(async () => {
    const data = await getSelect(['months'])

    const [day, month, year] = dayjs().format('DD/MM/YYYY').split('/')

    return data.slice(Number(month) - 1)
}, null)

const municipalities = computedAsync(async () => {
    return await getSelect(['municipalities'])
}, null)

const groups = ref<any>([])

const groupsLists = ref<any>([])

watch(form, (newVal, oldVal) => {
    groupsFilter()
    checkChronogram()
})

const groupsFilter = () => {
    
    let lists = []

    for (let i = 0; i < form.groups.length; i++) {
        if(form.groups.length == 1) {
            lists.push(groups.value)
            break
        }
        let list = groups.value
        for (let j = 0; j < form.groups.length; j++) {
            if (j == i) continue
            let groupSelected = form.groups[j].group_id
            list = list.filter(({ value } : { value: string }) => value != groupSelected)
        }
        lists.push(list)
    }
    groupsLists.value = lists
}

const sports = computedAsync(async () => {
    return await getDisciplinesByMonitor(onboardingStore().get_user.id as number)
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
            console.log(response.data.items)
            form.status_id = response.data.items.status_id;
            form.month = response.data.items.month;
            form.municipality = response.data.items.municipality;
            form.note = response.data.items.note;
            form.note_holiday = response.data.items.note_holiday
            form.groups = response.data.items.groups;
            form.rejection_message = response.data.items.rejection_message;
            // form.gender = response.data.items.gender;
            // form.phone = response.data.items.phone;
            // form.document_type = response.data.items.document_type;
            // form.document_number = response.data.items.document_number;
            // form.roles = response.data.items.roles[0];
            // alerts.custom('', response?.data.message, 'info');
            dataLoaded.value = true
        } else {
            alerts.custom("", "No se pudieron obtener los datos", "error");
        }
        console.log(form);
    });
}

onBeforeMount(async () => {
    groups.value = await getSelect(['groups'])
    groupsLists.value = [groups.value]
    await fetch();
})

const checkChronogram = () => {
    
    let hayCruce = false; 

    for( let i = 0; i < form.groups.length; i++) {

        const schedules = form.groups[i].schedules;

        for( let j = 0; j < schedules.length; j++ ) {

            const horario = schedules[j];
            if ( !horario ) continue

            hayCruce = searchItem( i+1, horario );

            if(hayCruce) break;
        }

        if(hayCruce) break;
    }

    return hayCruce
}

const searchItem = ( grupo: number, horario: any ) => {
    let hayCruce = false;
    let grupoCruce;

    for( let i = 0; i < form.groups.length; i++) {
        const filterSameDay = form.groups[i].schedules.filter((item: any) => item.idx !== horario.idx && item.day === horario.day && item.start_time && item.end_time);
        
        filterSameDay.forEach( (item: any, idx: number) => {
            if( idx === 4 || !horario.start_time || !horario.end_time) return
            else if( 
                (item.start_time <= horario.start_time && item.end_time <= horario.end_time && item.end_time > horario.start_time) ||
                (item.start_time >= horario.start_time && item.end_time >= horario.end_time && item.start_time < horario.end_time) ||
                (item.start_time >= horario.start_time && item.end_time <= horario.end_time) ||
                (item.start_time <= horario.start_time && item.end_time >= horario.end_time) ||
                (item.start_time == horario.start_time && item.end_time == horario.end_time)
            ) {
                hayCruce = true;
                if (i != grupo) grupoCruce = i;
                return;
            }
        })

        if ( hayCruce ){
            if (grupoCruce) {
                alerts.custom('Validación', `Por favor verifique el horario cruzado del grupo ${form.groups[grupo].group_id} ${horario.day} de ${horario.start_time} a ${horario.end_time} porque se cruza con el grupo ${form.groups[grupoCruce].group_id}.`, 'error')
            } else {
                alerts.custom('Validación', `Por favor verifique el horario cruzado del grupo ${form.groups[grupo].group_id} ${horario.day} de ${horario.start_time} a ${horario.end_time} ya que se cruza con otro de los horarios de este grupo.`, 'error')
            }
            break;
        }
    }

    return hayCruce;
}

const onAddGrupo = () => {
    if ( form.groups.length < 4 ) {
        form.groups.push({ ...groupBone, schedules: [{...scheduleBone, idx: new Date().getTime()}] })
    }
}

const removeChild = (pos: number, group: any) => {
    group.schedules.splice( pos, 1 )
}

let holidaysMonth:string;

watch(
	() => form.month,
	(newVal: any) => {
        if (newVal) {
            const res = organizeHolidays(newVal);
            holidaysMonth = res;
		}
	}
);

const onDownload = async () => {
    //
	return await chronogramServices.getFileChronogram(route.params.id as string).then((res:any) => {
		if (res) {
			if (res.status >= 200 && res.status <= 300) {
				downloadFile(res);
			}
		}
	}).finally(()=>{/*router.push({ name: 'chronograms.index' })*/});
};

</script>

<template>
    <div class="flex items-center mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">{{form.status_id === 4 ? 'Creación de Cronograma':'Ver Cronograma'}}</h2>
    </div>

    <div class="p-5 mt-5 intro-y box" v-if="dataLoaded">
        <div
			class="mb-6"
			v-if="form.status_id == 4">
			<p class="text-danger font-bold">Razon de rechazo</p>
			<p>{{ form.rejection_message }}</p>
		</div>
        <form @submit.prevent="onSubmit" class="space-y-8 divide-y divide-slate-200">
            <div class="space-y-8 divide-y divide-slate-200">
                <div>
                    <h3 class="text-lg font-medium leading-6 text-gray-900">
                        Cronograma
                    </h3>

                    <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                        <CommonSelect label="Mes del cronograma *" name="month" v-model="form.month" :validator="v$"
                            :options="months" :allowEmpty="false"
                            :disabled="form.status_id !== 4"
                        />
                        <CommonSelect label="Municipio *" name="municipality" v-model="form.municipality"
                            :validator="v$" :options="municipalities"
                            :disabled="form.status_id !== 4"
                        />
                        <div class="col-span-1 md:col-span-2">
                            <CommonEditor label="observaciones" name="note" v-model="form.note" :validator="v$" 
                                :disabled="form.status_id !== 4"
                            />
                        </div>
                        <div v-if="holidaysMonth" class="col-span-1 md:col-span-2">
							<CommonEditor label="Observaciones Dias Festivos" name="note_holiday" v-model="form.note_holiday"
								:validator="v$" 
                                :disabled="form.status_id !== 4"/>
							<p class="mt-2">{{ form.month && holidaysMonth }}</p>
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
                                            :collection_validator="{ index, name: 'groups', v$ }" :options="groupsLists[index]" 
                                            :disabled="form.status_id !== 4"
                                        />

                                        <CommonSelect label="Modalidad deportiva *" name="sports_modality" :allowEmpty="false"
                                            v-model="group.sports_modality"
                                            :collection_validator="{ index, name: 'groups', v$ }"
                                            :options="sports"
                                            :disabled="form.status_id !== 4"
                                        />

                                        <CommonInput type="text" placeholder="Ingrese"
                                            label="Escenario deportivo principal - Nombre *"
                                            name="main_sports_stage_name" v-model="group.main_sports_stage_name"
                                            :collection_validator="{ index, name: 'groups', v$ }"
                                            :disabled="form.status_id !== 4"
                                        
                                        />

                                        <CommonInput type="text" placeholder="Ingrese"
                                            label="Escenario deportivo principal - Dirección *"
                                            name="main_sports_stage_address" v-model="group.main_sports_stage_address"
                                            :collection_validator="{ index, name: 'groups', v$ }" 
                                            :disabled="form.status_id !== 4"
                                        />

                                        <CommonInput type="text" placeholder="Ingrese"
                                            label="Escenario deportivo alternativo - Nombre *"
                                            name="alt_sports_stage_name" v-model="group.alt_sports_stage_name"
                                            :collection_validator="{ index, name: 'groups', v$ }" 
                                            :disabled="form.status_id !== 4"
                                        />

                                        <CommonInput type="text" placeholder="Ingrese"
                                            label="Escenario deportivo alternativo - Dirección *"
                                            name="alt_sports_stage_address" v-model="group.alt_sports_stage_address"
                                            :collection_validator="{ index, name: 'groups', v$ }" 
                                            :disabled="form.status_id !== 4"
                                        />

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
                                                                    :status_id ="form.status_id"
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
                                                                    type="button" variant="outline-primary"
                                                                    v-if="form.status_id === 4 && index < 4"
                                                                >
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
                                                variant="outline-danger" size="sm"
                                                v-if="form.status_id === 4"
                                            >
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
                                v-if="form.status_id === 4"
                            >
                                <Lucide icon="Plus" class="mr-2" />
                                Agregar grupo
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="pt-5" v-if="form.status_id === 4">
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
        <div class="pt-5">
                <div class="flex justify-end gap-x-4">
                    <Button v-if="form.status_id != 4" variant="primary" class="btn btn-primary text-sm" 
                    @click="onDownload" :title="'Descargar formulario'">
                        <Lucide :class="'mr-2'" :icon="'Download'"/> Descargar
                    </Button>

                    <Button @click="$router.push({ name: 'chronograms.index' })" type="button"
                        variant="outline-secondary">
                        Cancelar
                    </Button>                    
                </div>
            </div>
    </div>
</template>