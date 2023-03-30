<script setup lang="ts">
import { required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { onboardingStore } from "@/stores/onboardingStore";
import { filePondValue } from '@/composables/useFilepondEvents';
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

const props = defineProps<{
    closeModal: Function;
    id_review: String | number;
}>();

const form = reactive({
    date_visit: "",
    hour_visit: "",
    municipality: "",
    sidewalk: "",
    monitor: "",
    discipline: "",
    sports_scene: "",
    beneficiary_coverage: "",
    meets_monthly_technical_development: "",
    event_support: "",
    description: "",
    observations: "",
    file: [],
    createdBy: { id: '1', name: 'Joselito' },
    status: "", //id:2 => En revisión => ENR
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

const municipality_id = computed(() => form.municipality)

//Usar para traer monitores por municipio cuando haya funcion
const monitorList = [ //No olvidar llamar las funciones cuando se selecciones con @select en el componente
    { label: "Joselito", value: 1 },
    { label: "Miguelito", value: 2 },
    //async () => {
    //     return municipality_id.value ? await getMonitorsByMunicipaly(municipality_id.value) : []
    //  }
];

//Sacar disciplinas por monitor
const disciplinesList = ref([]);
//[ //No olvidar llamar las funciones cuando se selecciones con @select en el componente
//async () => {
//     return municipality_id.value ? await getDisciplinesByMonitor(form.moniror) : []
//  }
//]


//Esta es la que está usando para traer disciplinas pero las trae todas
// const fetch = async () => {
//     await store.getListSelect().then((response) => {
//         console.log(`data fetch: ${response?.data}`);
//         if (response?.status == 200 || response?.status == 201) {
//             disciplinesList.value = JSON.parse(JSON.stringify(response.data["diciplines"]));
//         } else {
//             Swal.fire("", "No se pudieron obtener los datos", "error");
//         }
//     });
// };

const yes_no_List = [
    { label: "Si", value: 1 },
    { label: "No", value: 2 },
];

const statusesList = ref<selectOption[]>([
    { label: 'Aprobado', value: '1' },
    { label: 'Rechazado', value: '4' }
])

// const routeName = computed(() => {
//     return String(route.name).split(".")[0];
// });

const dataLoaded = ref(false)
//Verificar si se puede hacer con asycComputed
const getData = async () => {

    await subdirectorVisitServices.get(props.id_review as string).then((response) => {
        console.log(response?.data.items);
        if (response?.status == 200 || response?.status == 201) {
            form.date_visit = response.data.items.date_visit;
            form.hour_visit = response.data.items.hour_visit;
            form.municipality = response.data.items.municipality;
            form.sidewalk = response.data.items.sidewalk;
            form.monitor = response.data.items.monitor;
            form.discipline = response.data.items.discipline;
            form.sports_scene = response.data.items.sports_scene;
            form.beneficiary_coverage = response.data.items.beneficiary_coverage;
            form.meets_monthly_technical_development = response.data.items.meets_monthly_technical_development;
            form.event_support = response.data.items.event_support;
            form.description = response.data.items.description;
            form.observations = response.data.items.observations;
            form.status = response.data.items.status;
            form.reason = response.data.items.reason;
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
        await subdirectorVisitServices.update(route.params.id as string, formdataParser(form)).then((response) => {
            if (response) {
                if (response.status >= 200 && response.status <= 300) {
                    props.closeModal
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
        <h1 class="mr-auto text-lg font-medium">Revisar visitas de los Subdirectores</h1>
    </div>

    <div class="space-y-2 box px-5 py-4">
        <h2 class="font-bold">Revisión</h2>
        <CommonSelect @select="defineReason" label="Estado de la tarea *" name="status" v-model="form.status"
            :validator="v$" :options="statusesList" />
        <div v-if="form.status == '4'" class="pt-4">
            <CommonTextarea name="reason" class="" label="Comentario *" placeholder="Escriba..." rows="5"
                v-model="form.reason" :validator="v$" />
        </div>
        <div class="mt-6 flex justify-end col-span-1 md:col-span-2 border-none gap-1" tabindex="1">
            <Button variant="danger" @click="props.closeModal">Cerrar</Button>
            <Button variant="primary" class="btn btn-primary" @click="onSubmit">
                Enviar
            </Button>
        </div>
    </div>

    <div v-if="dataLoaded" class="p-5 pt-1 mt-5 intro-y box">
        <div class="my-4">
            <h3><span class="font-bold">Subdirector:</span> {{ form.createdBy.name }}</h3>
        </div>
        <div class="grid grid-cols-2 md:grid md:grid-cols-2 gap-6 justify-evenly mt-4">
            <CommonInput disabled type="date" label="Fecha  *" name="date_visit" v-model="form.date_visit" />
            <CommonInput disabled type="time" label="Hora  *" name="hour_visit" v-model="form.hour_visit" />
            <CommonSelect disabled label="Municipio *" name="municipality" v-model="form.municipality"
                :options="municipalities" />

            <CommonInput disabled type="text" placeholder="Ingrese" label="Corregimiento / Vereda *" name="sidewalk"
                v-model="form.sidewalk" />
            <CommonSelect disabled label="Monitor *" name="monitor" v-model="form.monitor" :options="monitorList" />
            <CommonSelect disabled label="Diciplinas *" name="discipline" v-model="form.discipline"
                :options="disciplinesList" />
            <CommonInput disabled type="text" placeholder="Ingrese" label="Escenario deportivo *" name="sports_scene"
                v-model="form.sports_scene" />
            <CommonInput disabled type="number" placeholder="Ingrese" label="Cobertura de benificiario *"
                name="beneficiary_coverage" v-model="form.beneficiary_coverage" />
            <CommonSelect disabled label="Cumple con el desarrollo del componente técnico del mes *"
                name="meets_monthly_technical_development" v-model="form.meets_monthly_technical_development"
                :options="yes_no_List" />
            <CommonSelect disabled label="Apoyo a eventos *" name="event_support" v-model="form.event_support"
                :options="yes_no_List" />

            <!--  -->
        </div>
        <div class="col-span-3 sm:grid-cols-3 my-3">
            <CommonTextarea disabled name="description" label="Descripción *" rows="5" placeholder="Escriba..."
                v-model="form.description" />
        </div>
        <div class="col-span-3 sm:grid-cols-3">
            <CommonTextarea disabled name="observations" label="Observarciones *" rows="5" placeholder="Escriba..."
                v-model="form.observations" />
        </div>
        <div class="grid justify-center col-span-3 gap-10 p-5">
            <h1 class="text-center font-bold">Evidencia</h1>
            <!-- <img v-if="form.file" :src="form.file[0]" alt=""> -->
            <img src="/semilleros.png" width="200" alt="">
        </div>
    </div>
</template>
