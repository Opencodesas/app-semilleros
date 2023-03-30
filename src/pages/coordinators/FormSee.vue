<script setup lang="ts">
import CommonFile from '@/components/CommonFile.vue';
import { filePondValue } from '@/composables/useFilepondEvents';
import { onboardingStore } from '@/stores/onboardingStore';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import Swal from 'sweetalert2';

const { multiple } = useFilepondEvents();
const store = onboardingStore();
const router = useRouter();
const route = useRoute();
const dataLoaded = ref(false);
const form = reactive({
    id:'',
	rejection_message: '',
	date_visit: '',
	hour_visit: '',
	municipality_id: '',
	sidewalk: '',
	monitor_id: '',
	discipline_id: '',
	sports_scene: '',
	beneficiary_coverage: '',
	description: '',
	observations: '',
	file: [],
	created_by: store.user.id,
    status_id:'2'
});

const form_rules = computed(() => ({
	rejection_message: {},
	date_visit: { required },
	hour_visit: { required },
	municipality_id: { required },
	sidewalk: { required },
	monitor_id: { required },
	discipline_id: { required },
	sports_scene: { required },
	beneficiary_coverage: { required },
	description: { required },
	observations: { required },
	file: { required },
	created_by: {},
}));

const disciplinesList = ref([]);
const monitorList = [
	{ label: 'Joselito', value: 1 },
	{ label: 'Miguelito', value: 2 },
];
const event_supportList = [
	{ label: 'Si', value: 1 },
	{ label: 'No', value: 2 },
];
const evaluationList = [
	{ label: 'Aceptada', value: 1 },
	{ label: 'Rechazada', value: 2 },
];
const v$ = useVuelidate(form_rules, form);

const municipalities = asyncComputed(async () => {
	return await getSelect(['municipalities']);
}, null);

const disciplines = asyncComputed(async () => {
	return await getSelect(['disciplines']);
}, null);

const fetch = async () => {
    await store.getListSelect().then((response) => {
        console.log(`data fetch: ${response?.data}`);
        if (response?.status == 200 || response?.status == 201) {
            municipalities.value = JSON.parse(JSON.stringify(response.data["municipalities"]));
            disciplinesList.value = JSON.parse(JSON.stringify(response.data["diciplines"]));
        } else {
            Swal.fire("", "No se pudieron obtener los datos", "error");
        }
    });
    await coordinatorVisitServices.get(route.params.id as string).then((response) => {
            console.log(response?.data.items);
        if (response?.status == 200 || response?.status == 201) {
            form.id = response.data.items.id;
            form.beneficiary_coverage = response.data.items.beneficiary_coverage;
            form.date_visit = response.data.items.date_visit;
            form.hour_visit = response.data.items.hour_visit;
            form.sports_scene = response.data.items.sports_scene;
            form.observations = response.data.items.observations;
            form.description = response.data.items.description;
            form.discipline_id = response.data.items.discipline_id;
            form.municipality_id = response.data.items.municipalitie_id;
            form.monitor_id =response.data.items.user_id,
            form.sidewalk = response.data.items.sidewalk,
            form.status_id =response.data.items.status_id,
            console.log(form)
            dataLoaded.value = true;
        }
        else{
            Swal.fire("", "No se pudieron obtener los datos", "error");
        }
    });
};
onMounted(() => {
    fetch();
});

const onSubmit = async () => {
    const valid = await v$.value.$validate();
    form.id = route.params.id as string;
    if (valid) {
        await coordinatorVisitServices.update(route.params.id as string,formdataParser(form)).then((response) => {
            if (response) {
                if (response.status >= 200 && response.status <= 300) {
                    alerts.update()
                    setLoading(true)
                    router.push('').finally(() => {
                        setLoading(false)
                    })
                }
            }
        })
    } else {
        alerts.validation();
    }
};
</script>
<template>
	<div class="flex items-center mt-8 intro-y">
		<div class="flex items-center space-x-4">
			<CommonBackButton
				:to="'coordinator_visit.index'"
				title="Listado" />
			<h2 class="mr-auto text-lg font-medium">Actualizar visita</h2>
		</div>
	</div>
    <div class="conten" v-if="dataLoaded">
        <div class="p-5 mt-5 intro-y box">
            <div class="grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
                <CommonInput
                    type="date"
                    label="Fecha  *"
                    name="date_visit"
                    v-model="form.date_visit"
                    :validator="v$"
                    disabled />
                <CommonInput
                    type="time"
                    label="Hora  *"
                    name="hour_visit"
                    v-model="form.hour_visit"
                    :validator="v$"
                    disabled />
                <CommonSelect
                    label="Municipio *"
                    placeholder="Seleccione"
                    name="municipality_id"
                    class="cursor-pointer"
                    v-model="form.municipality_id"
                    :validator="v$"
                    :options="municipalities"
                    disabled />

                <CommonInput
                    type="text"
                    placeholder="Ingrese el corregimiento o vereda"
                    label="Corregimiento / Vereda *"
                    name="sidewalk"
                    v-model="form.sidewalk"
                    :validator="v$"
                    disabled />
                <CommonSelect
                    label="Monitor *"
                    name="monitor_id"
                    placeholder="Seleccione"
                    class="cursor-pointer"
                    v-model="form.monitor_id"
                    :validator="v$"
                    :options="monitorList"
                    disabled />
                <CommonSelect
                    label="Disciplinas *"
                    placeholder="Seleccione"
                    name="discipline_id"
                    class="cursor-pointer"
                    v-model="form.discipline_id"
                    :validator="v$"
                    :options="disciplinesList" 
                    disabled/>
                <CommonInput
                    type="text"
                    placeholder="Ingrese el escenario deportivo"
                    label="Escenario deportivo *"
                    name="sports_scene"
                    v-model="form.sports_scene"
                    :validator="v$" 
                    disabled/>
                <CommonInput
                    type="number"
                    min="0"
                    placeholder="Ingrese un numero de beneficiarios"
                    label="Cobertura de benificiario *"
                    name="beneficiary_coverage"
                    v-model="form.beneficiary_coverage"
                    :validator="v$" 
                    disabled/>
            </div>
            <div class="mt-6 intro-y">
                <CommonTextarea
                    label="Descripcion *"
                    rows="5"
                    placeholder="Ingrese las Descripcion"
                    name="description"
                    v-model="form.description"
                    :validator="v$" 
                    disabled/>
            </div>
            <div class="mt-6 intro-y">
                <CommonTextarea
                    label="Observaciones *"
                    rows="5"
                    placeholder="Ingrese las observaciones"
                    name="observations"
                    v-model="form.observations"
                    :validator="v$" 
                    disabled/>
            </div>
            <div class="p-5 mt-6 intro-y">
                <CommonFile
                    :validator="v$"
                    v-model="form.file"
                    name="file"
                    class="w-11/12 sm:w-8/12 m-auto cursor-pointer"
                    @addfile="(error: any, value: filePondValue) => { form.file = multiple.addfile({ error, value }, form.file) as never[] }"
                    @removefile="(error: any, value: filePondValue) => { form.file = multiple.removefile({ error, value }, form.file) as never[] }" disabled/>
            </div>
        </div>
        <div class="mt-6 flex justify-end col-span-1 md:col-span-2">
            <div class="flex items-center space-x-4">
                <CommonBackButton to="coordinator_visit.index" title="Listado" />
            </div>
        </div>
    </div>
    <div class="grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly" v-else>
    Cargando datos...
    </div>
</template>