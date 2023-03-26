<script setup lang="ts">
import { required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { onboardingStore } from "@/stores/onboardingStore";
import { filePondValue } from '@/composables/useFilepondEvents';
import { transversalActivityServices } from '@/services/psychosocial/transversalActivityServices';
import { selectOption } from '@/components/CommonSelect.vue';
// import { addFile } from "@/types/filepond";
// import Swal, { SweetAlertIcon } from "sweetalert2";
// import { formToJSON } from "axios";
// import { json } from "stream/consumers";
// import { forEach } from "lodash";


const { multiple } = useFilepondEvents();

const router = useRouter();
const route = useRoute();
const store = onboardingStore();

const form = reactive({
    municipality: {},
    date: '',
    attenders: '',
    transversal_activity: '',
    activity_objetive: '',
    scenario: '',
    planning_meetings: '',
    socialization_team: '',
    activity_development: '',
    network_content: '',
    files: [],
    createdBy: { ide: '1', name: 'Joselito' },
    status: "",
    reason: 'Rechazado ya que...',
});

const form_rules = computed(() => ({
    reason: { required },
    status: { required },
}));

const v$ = useVuelidate(form_rules, form);

const municipalities = asyncComputed(async () => {
    return await getSelect(['municipalities'])
}, null)


const yes_no_List = [
    { label: "Si", value: 1 },
    { label: "No", value: 2 },
];

const statusesList = ref<selectOption[]>([
    { label: 'Aprobado', value: '1' },
    { label: 'Rechazado', value: '4' }
])

const dataLoaded = ref(false)

const getData = async () => {

    await transversalActivityServices.get(route.params.id as string).then((response) => {
        console.log(response?.data.items);
        if (response?.status == 200 || response?.status == 201) {
            form.municipality = response.data.items.municipality;
            form.date = response.data.items.date;
            form.attenders = response.data.items.attenders;
            form.transversal_activity = response.data.items.transversal_activity;
            form.activity_objetive = response.data.items.activity_objetive;
            form.scenario = response.data.items.scenario;
            form.planning_meetings = response.data.items.planning_meetings;
            form.socialization_team = response.data.items.socialization_team;
            form.activity_development = response.data.items.activity_development;
            form.network_content = response.data.items.network_content;
            form.files = response.data.items.files;
            form.createdBy = response.data.items.createdBy;

        } else {
            alerts.custom("", "No se pudieron obtener los datos", "error");
        }
        console.log(form);
    })
};


onMounted(async () => {
    console.log(route);
    await getData();
    dataLoaded.value = true;
    console.log(form.status)
});



const onSubmit = async () => {
    const valid = await v$.value.$validate()
    if (valid) {
        await transversalActivityServices.update(route.params.id as string, formdataParser(form)).then((response) => {
            if (response) {
                if (response.status >= 200 && response.status <= 300) {
                    alerts.update()
                    setLoading(true)
                    router.push('psychosocial-coordinator.reviews').finally(() => {
                        setLoading(false)
                    })
                }
            }
        })
    }
    else {
        alerts.validation()
    }
}

const defineReason = () => {
    if (form.status == '1') form.reason = '';
}
</script>

<template>
    <div class="flex items-center justify-between mt-5 mb-2 intro-y">
        <h1 class="mr-auto text-lg font-medium">Revisar Actividad Transversal</h1>
    </div>

    <div class="space-y-2 box px-5 py-4">
        <h2 class="font-bold">Revisión</h2>
        <CommonSelect @select="defineReason" label="Estado de la tarea *" name="status" v-model="form.status"
            :validator="v$" :options="statusesList" />
        <div v-if="form.status == '4'" class="pt-4">
            <CommonTextarea name="reason" class="" label="Comentario *" placeholder="Escriba..." rows="5"
                v-model="form.reason" :validator="v$" />
        </div>
    </div>

    <div v-if="dataLoaded" class="p-5 pt-1 mt-5 intro-y box">
        <div class="my-4">
            <h3><span class="font-bold">Psicologo:</span> {{ form.createdBy.name }}</h3>
        </div>
        <div class="grid grid-cols-3 gap-6 justify-evenly mt-4">
            <CommonSelect disabled label="Municipio *" name="municipality" v-model="form.municipality.name"
                :options="municipalities" />
            <CommonInput disabled type="date" label="Fecha  *" name="date_visit" v-model="form.date" />
            <CommonInput disabled type="number" label="No. Asistentes *" name="attenders" v-model="form.attenders" />
        </div>
        <div class="mt-5 space-y-5">
            <CommonInput disabled type="text" label="Actividad Transversal  *" name="transversal_activity"
                v-model="form.transversal_activity" />
            <CommonInput disabled type="text" label="Objetivo de la actividad  *" name="activity_objetive"
                v-model="form.activity_objetive" />
            <CommonInput disabled type="text" label="Escenario  *" name="scenario" v-model="form.scenario" />

            <CommonTextarea disabled name="planning_meetings" label="Reuniones de Planeación *" rows="5"
                placeholder="Escriba..." v-model="form.planning_meetings" />
            <CommonTextarea disabled name="socialization_team" label="Socialización con el Equipo de Trabajo *" rows="5"
                placeholder="Escriba..." v-model="form.socialization_team" />
            <CommonTextarea disabled name="activity_development" label="Desarrollo de la Actividad *" rows="5"
                placeholder="Escriba..." v-model="form.activity_development" />
            <CommonTextarea disabled name="network_content" label="Contenido de Redes *" rows="5" placeholder="Escriba..."
                v-model="form.network_content" />
        </div>
        <div class="grid justify-center col-span-3 gap-10 p-5">
            <h1 class="text-center font-bold">Evidencia</h1>
            <!-- <img v-if="form.file" v-for="x in files" :src="x.url" alt=""> -->
            <img src="/semilleros.png" width="200" alt="">
        </div>
        <div class="pt-5">
            <div class="text-right space-x-3 mx-5 pt-5">
                <Button type="button" variant="dark" class="w-24"
                    @click="() => { router.push({ name: 'psychosocial-coordinator.reviews' }) }">
                    Cancelar
                </Button>
                <Button @click="onSubmit" variant="primary" class="w-24">
                    Revisar
                </Button>
            </div>
        </div>
    </div>
</template>
