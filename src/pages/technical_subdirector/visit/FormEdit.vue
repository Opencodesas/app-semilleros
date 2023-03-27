<script setup lang="ts">
import { required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { onboardingStore } from "@/stores/onboardingStore";
import { filePondValue } from '@/composables/useFilepondEvents';
import { technicalSubdirectorVisitServices } from '@/services/technical_subdirector/technicalSubdirectorVisitServices';
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
    date: "",
    hour: "",
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
    status: "4", //id:2 => En revisión => ENR
    reason: 'Rechazado ya que...',
});

const form_rules = computed(() => ({
    date: { required },
    hour: { required },
    municipality: { required },
    sidewalk: { required },
    monitor: { required },
    discipline: { required },
    sports_scene: { required },
    beneficiary_coverage: { required },
    meets_monthly_technical_development: { required },
    event_support: { required },
    description: { required },
    observations: { required },
}));

const file = ref();
const file_rule = computed(() => ({
    file: { required },
}))

const v$ = useVuelidate(form_rules, form);
const vFile$ = useVuelidate(file_rule, file);

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


// const routeName = computed(() => {
//     return String(route.name).split(".")[0];
// });

const dataLoaded = ref(false)
//Verificar si se puede hacer con asycComputed
const getData = async () => {

    await technicalSubdirectorVisitServices.get(route.params.id as string).then((response) => {
        console.log(response?.data.items);
        if (response?.status == 200 || response?.status == 201) {
            form.date = response.data.items.date;
            form.hour = response.data.items.hour;
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
    //form.status = `${route.params.id}`
    console.log(form.status)
});



const onSubmit = async () => {
    const valid = await v$.value.$validate()

    if (valid) {
        await technicalSubdirectorVisitServices.create(formdataParser(form)).then((response) => {
            if (response) {
                if (response.status >= 200 && response.status <= 300) {
                    alerts.create()
                    setLoading(true)

                    router.push('/dashboard').finally(() => {
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

const diableElements = computed(() => {
    return form.status == '4' ? false : true; //id: 4 => Rechazado => REC
})

//Para cuando haya api para descargar el archivo
const download = () => {

}
</script>

<template>
    <div class="flex items-center justify-between mt-8 intro-y">
        <h2 v-if="form.status == '4'" class="mr-auto text-lg font-medium">Editar visita</h2>
        <h2 v-else class="mr-auto text-lg font-medium">Vista visita</h2>
    </div>

    <div v-if="dataLoaded" class="p-5 pt-1 mt-5 intro-y box">
        <div v-if="form.status == '4'" class="">
            <h2 class="text-red-600 font-bold py-2">Razón de rechazo</h2>
            <p class="text-left">{{ form.reason }}</p>
        </div>
        <div class="grid grid-cols-2 md:grid md:grid-cols-2 gap-6 justify-evenly mt-4">
            <CommonInput :disabled="diableElements" type="date" label="Fecha  *" name="date" v-model="form.date"
                :validator="v$" />
            <CommonInput :disabled="diableElements" type="time" label="Hora  *" name="hour" v-model="form.hour"
                :validator="v$" />
            <CommonSelect :disabled="diableElements" label="Municipio *" name="municipality" v-model="form.municipality"
                :validator="v$" :options="municipalities" />

            <CommonInput :disabled="diableElements" type="text" placeholder="Ingrese" label="Corregimiento / Vereda *"
                name="sidewalk" v-model="form.sidewalk" :validator="v$" />
            <CommonSelect :disabled="diableElements" label="Monitor *" name="monitor" v-model="form.monitor" :validator="v$"
                :options="monitorList" />
            <CommonSelect :disabled="diableElements" label="Diciplinas *" name="discipline" v-model="form.discipline"
                :validator="v$" :options="disciplinesList" />
            <CommonInput :disabled="diableElements" type="text" placeholder="Ingrese" label="Escenario deportivo *"
                name="sports_scene" v-model="form.sports_scene" :validator="v$" />
            <CommonInput :disabled="diableElements" type="number" placeholder="Ingrese" label="Cobertura de benificiario *"
                name="beneficiary_coverage" v-model="form.beneficiary_coverage" :validator="v$" />
            <CommonSelect :disabled="diableElements" label="Cumple con el desarrollo del componente técnico del mes *"
                name="meets_monthly_technical_development" v-model="form.meets_monthly_technical_development"
                :validator="v$" :options="yes_no_List" />
            <CommonSelect :disabled="diableElements" label="Apoyo a eventos *" name="event_support"
                v-model="form.event_support" :validator="v$" :options="yes_no_List" />

            <!--  -->
        </div>
        <div class="col-span-3 sm:grid-cols-3 my-3">
            <CommonTextarea :disabled="diableElements" name="description" label="Descripción *" rows="5"
                placeholder="Escriba..." v-model="form.description" :validator="v$" />
        </div>
        <div class="col-span-3 sm:grid-cols-3">
            <CommonTextarea :disabled="diableElements" name="observations" label="Observarciones *" rows="5"
                placeholder="Escriba..." v-model="form.observations" :validator="v$" />
        </div>
        <div class="grid justify-center col-span-3 gap-10 p-5">
            <h1 class="text-center font-bold">Evidencia</h1>
            <!-- <img v-if="form.file" :src="form.file[0]" alt=""> -->
            <img src="/semilleros.png" width="200" alt="">
        </div>

        <div v-if="form.status == '4'" class="grid col-span-3 pt-3">
            <CommonDropzone name="file" label="Suba su archivo aqui *" :accept-multiple="false" v-model="file"
                @addfile="(error: any, value: filePondValue) => { file = multiple.addfile({ error, value }, file) as never[] }"
                @removefile="(error: any, value: filePondValue) => { file = multiple.removefile({ error, value }, file) as never[] }"
                :validator="vFile$" />
        </div>

        <div class="pt-5">
            <div class="flex justify-center gap-x-4">
                <Button v-if="form.status == '4'" @click="onSubmit" variant="primary">
                    Editar visita
                </Button>

                <Button v-else-if="form.status == '1'" type="button" variant="dark" @click="download">
                    Descargar visita
                </Button>
                <Button v-else type="button" variant="dark"
                    @click="() => { router.push({ name: 'technical_subdirector.visits' }) }">
                    Atrás
                </Button>
            </div>
        </div>
    </div>
</template>
