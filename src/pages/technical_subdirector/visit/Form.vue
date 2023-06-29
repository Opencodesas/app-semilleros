<script setup lang="ts">
import { addFile } from "@/types/filepond";
import { required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import Swal, { SweetAlertIcon } from "sweetalert2";
import { onboardingStore } from "@/stores/onboardingStore";
import { formToJSON } from "axios";
import { json } from "stream/consumers";
import { forEach } from "lodash";
import { filePondValue } from '@/composables/useFilepondEvents';
import { subdirectorVisitServices } from '@/services/technical_subdirector/subdirectorVisitServices';


const { multiple } = useFilepondEvents();

const store = onboardingStore();

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
    status: "2", //id:2 => En revisión => ENR
    //createdBy: store.get_user, Preguntar si es necesario

});

const form_rules = computed(() => ({
    date_visit: { required },
    hour_visit: { required },
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
    //asyncComputed(async () => {
    //     return municipality_id.value ? await getMonitorsByMunicipaly(municipality_id.value) : []
    //  }, null)
];

//Sacar disciplinas por monitor
const disciplinesList = ref([]);
//[ //No olvidar llamar las funciones cuando se selecciones con @select en el componente
    //asyncComputed(async () => {
    //     return municipality_id.value ? await getDisciplinesByMonitor(form.moniror) : []
    //  }, null)
//]


//Esta es la que está usando para traer disciplinas pero las trae todas
const fetch = async () => {
    await store.getListSelect().then((response) => {
        console.log(`data fetch: ${response?.data}`);
        if (response?.status == 200 || response?.status == 201) {
            disciplinesList.value = JSON.parse(JSON.stringify(response.data["diciplines"]));
        } else {
            Swal.fire("", "No se pudieron obtener los datos", "error");
        }
    });
};

const yes_no_List = [
    { label: "Si", value: 1 },
    { label: "No", value: 2 },
];

const router = useRouter();
const route = useRoute();

const routeName = computed(() => {
    return String(route.name).split(".")[0];
});


onMounted(() => {
    fetch();
});



const onSubmit = async () => {
    const valid = await v$.value.$validate()

    if (valid) {
        await subdirectorVisitServices.create(formdataParser(form)).then((response) => {
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
</script>

<template>
    <div class="flex items-center mt-8 intro-y">
        <div class="flex items-center space-x-4">
            <h2 class="mr-auto text-lg font-medium">Registrar visita</h2>
        </div>
    </div>

    <div class="p-5 mt-5 intro-y box">
        <div class="grid grid-cols-2 md:grid md:grid-cols-2 gap-6 justify-evenly">
            <CommonInput type="date" label="Fecha  *" name="date_visit" v-model="form.date_visit" :validator="v$" />
            <CommonInput type="time" label="Hora  *" name="hour_visit" v-model="form.hour_visit" :validator="v$" />
            <CommonSelect label="Municipio *" name="municipality" v-model="form.municipality" :validator="v$"
                :options="municipalities" />

            <CommonInput type="text" placeholder="Ingrese" label="Corregimiento / Vereda *" name="sidewalk"
                v-model="form.sidewalk" :validator="v$" />
            <CommonSelect label="Monitor *" name="monitor" v-model="form.monitor" :validator="v$" :options="monitorList" />
            <CommonSelect label="Disciplinas *" name="discipline" v-model="form.discipline" :validator="v$"
                :options="disciplinesList" />
            <CommonInput type="text" placeholder="Ingrese" label="Escenario deportivo *" name="sports_scene"
                v-model="form.sports_scene" :validator="v$" />
            <CommonInput type="number" placeholder="Ingrese" label="Cobertura de benificiario *" name="beneficiary_coverage"
                v-model="form.beneficiary_coverage" :validator="v$" />
            <CommonSelect label="Cumple con el desarrollo del componente técnico del mes *"
                name="meets_monthly_technical_development" v-model="form.meets_monthly_technical_development"
                :validator="v$" :options="yes_no_List" />
            <CommonSelect label="Apoyo a eventos *" name="event_support" v-model="form.event_support" :validator="v$"
                :options="yes_no_List" />

            <!--  -->
        </div>
        <div class="col-span-3 sm:grid-cols-3 my-3">
            <CommonTextarea name="description" label="Descripción *" rows="5" placeholder="Escriba..."
                v-model="form.description" :validator="v$" />
        </div>
        <div class="col-span-3 sm:grid-cols-3">
            <CommonTextarea name="observations" label="Observarciones *" rows="5" placeholder="Escriba..."
                v-model="form.observations" :validator="v$" />
        </div>
        <div class="grid col-span-3 pt-3">
            <CommonDropzone name="file" label="Suba su archivo aqui *" :accept-multiple="false" v-model="file"
                @addfile="(error: any, value: filePondValue) => { file = multiple.addfile({ error, value }, file) as never[] }"
                @removefile="(error: any, value: filePondValue) => { file = multiple.removefile({ error, value }, file) as never[] }"
                :validator="vFile$" />
        </div>

        <div class="pt-5">
            <div class="flex justify-center gap-x-4">
                <Button type="submit" variant="dark">
                    Registrar
                </Button>
            </div>
        </div>
    </div>
</template>
