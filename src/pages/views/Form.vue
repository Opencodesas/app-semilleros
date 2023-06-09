<script setup lang="ts">
import { required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import Swal, { SweetAlertIcon } from "sweetalert2";
import FormSwitch from "@/base-components/Form/FormSwitch";
import { onboardingStore } from "@/stores/onboardingStore";
import CommonDropzone from "@/components/CommonDropzone.vue";
import { filePondEvent, filePondValue } from "@/composables/useFilepondEvents";

const store = onboardingStore();
const { multiple } = useFilepondEvents()

const form = reactive({
    observations: "",
    user_id: "",
    municipalitie_id: "",
    event_support_id: "",
    hour_visit: "",
    discipline_id: "",
    sidewalk_id: "",
    sports_scene: "",
    beneficiary_coverage: "",
    evaluation_id: "",
    date_visit: "",

    files: [],

    swich_plans_r: false,
    swich_plans_gm1: false,
    swich_plans_gm2: false,
    swich_plans_gm3: false,
    swich_plans_gm4: false,
    swich_plans_sc_1: false,
    swich_plans_sc_2: false,
    swich_plans_sc_3: false,
    swich_plans_sc_4: false,
    swich_plans_gm_1: false,
    swich_plans_gm_2: false,
    swich_plans_gm_3: false,
    swich_plans_gm_4: false,
    swich_plans_gm_5: false,
    swich_plans_gm_6: false,
    swich_plans_mp_1: false,
    swich_plans_mp_2: false,
    swich_plans_mp_3: false,
    swich_plans_mp_4: false,
    swich_plans_mp_5: false,
});

const form_rules = computed(() => ({
    observations: { required },
    user_id: { required },
    municipalitie_id: { required },
    event_support_id: { required },
    hour_visit: { required },
    discipline_id: { required },
    sidewalk_id: { required },
    sports_scene: { required },
    beneficiary_coverage: { required },
    evaluation_id: { required },
    date_visit: { required },

    files: [],

    swich_plans_r: { required },
    swich_plans_gm1: { required },
    swich_plans_gm2: { required },
    swich_plans_gm3: { required },
    swich_plans_gm4: { required },
    swich_plans_sc_1: { required },
    swich_plans_sc_2: { required },
    swich_plans_sc_3: { required },
    swich_plans_sc_4: { required },
    swich_plans_gm_1: { required },
    swich_plans_gm_2: { required },
    swich_plans_gm_3: { required },
    swich_plans_gm_4: { required },
    swich_plans_gm_5: { required },
    swich_plans_gm_6: { required },
    swich_plans_mp_1: { required },
    swich_plans_mp_2: { required },
    swich_plans_mp_3: { required },
    swich_plans_mp_4: { required },
    swich_plans_mp_5: { required },
}));

const municipalities = ref([]);
const disciplinesList = ref([]);
const sidewalks = ref([]);
const monitorList = [
    { label: "Joselito", value: 1 },
    { label: "Miguelito", value: 2 },
];
const event_supportList = [
    { label: "Si", value: 1 },
    { label: "No", value: 2 },
];
const evaluationList = [
    { label: "Aceptada", value: 1 },
    { label: "Rechazada", value: 2 },
];
const v$ = useVuelidate(form_rules, form);

const router = useRouter();
const route = useRoute();

const routeName = computed(() => {
    return String(route.name).split(".")[0];
});
var mun = [];
const fetch = async () => {
    await store.getListSelect().then((response) => {
        console.log(`data fetch: ${response?.data}`);
        if (response?.status == 200 || response?.status == 201) {
            municipalities.value = JSON.parse(JSON.stringify(response.data["municipalities"]));
            disciplinesList.value = JSON.parse(JSON.stringify(response.data["diciplines"]));
            sidewalks.value = JSON.parse(JSON.stringify(response.data["sidewalks"]));
        } else {
            Swal.fire("", "No se pudieron obtener los datos", "error");
        }
    });
};
onMounted(() => {
    fetch();
});

/**
 * Para los archivos, vas a desestructurar el objeto form
 *      { files, ...rest } = form
 *      let fd = formdataParser(rest)
 * 
 *      for (let i = 0; i < files.length; i++) {
 *          fd.append('files[]', files[i])
 *      }
 * 
 *      servicios.create(fd)
 */

const onSubmit = async () => {
    const valid = await v$.value.$validate();

    if (valid) {
        await methodologistVisitServices.create(formdataParser(form)).then((response) => {
            if (response) {
                if (response.status >= 200 && response.status <= 300) {
                    alerts.create()
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
            <CommonBackButton to="methodologist_visits.index" title="Listado" />
            <h2 class="mr-auto text-lg font-medium">Registrar visita</h2>
        </div>
    </div>

    <div class="p-5 mt-5 intro-y box">
        <div class="grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
            <CommonInput type="date" label="Fecha  *" name="date_visit" v-model="form.date_visit" :validator="v$" />
            <CommonInput type="time" label="Hora  *" name="hour_visit" v-model="form.hour_visit" :validator="v$" />
            <CommonSelect label="Municipio *" name="municipalitie_id" v-model="form.municipalitie_id" :validator="v$"
                :options="municipalities" />

            <CommonSelect label="Corregimiento / Vereda *" name="sidewalk_id" v-model="form.sidewalk_id" :validator="v$"
                :options="sidewalks" />

            <CommonSelect label="Monitor *" name="user_id" v-model="form.user_id" :validator="v$"
                :options="monitorList" />
            <CommonSelect label="Disciplinas *" name="discipline_id" v-model="form.discipline_id" :validator="v$"
                :options="disciplinesList" />
            <CommonInput type="text" placeholder="Ingrese" label="Escenario deportivo *" name="sports_scene"
                v-model="form.sports_scene" :validator="v$" />
            <CommonInput type="text" placeholder="Ingrese" label="Cobertura de benificiario *"
                name="beneficiary_coverage" v-model="form.beneficiary_coverage" :validator="v$" />
            <CommonSelect label="Evaluacion *" name="evaluation_id" v-model="form.evaluation_id" :validator="v$"
                :options="evaluationList" />
            <CommonSelect label="Apoyo a eventos *" name="event_support_id" v-model="form.event_support_id"
                :validator="v$" :options="event_supportList" />

            <!--  -->
        </div>
    </div>
    <div class="w-full py-6 mx-auto">
        <h2 class="text-center mr-auto text-lg font-medium">Requerimientos</h2>
    </div>
    <div class="p-5 intro-y box">
        <div class="grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly"></div>

        <FormSwitch.Input name="swich_plans" id="swich_plans" type="checkbox" v-model="form.swich_plans_r"
            :validator="v$" />
        <FormSwitch.Label htmlFor="swich_plans"> Plan de clases </FormSwitch.Label>
    </div>
    <div class="w-full py-6 mx-auto">
        <h2 class="text-center mr-auto text-lg font-medium">Sesión de clase</h2>
    </div>
    <div class="p-5 intro-y box">
        <div class="grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
            <FormSwitch>
                <FormSwitch.Input name="swich_plans_sc_1" id="swich_plans_sc_1" type="checkbox"
                    v-model="form.swich_plans_sc_1" />
                <FormSwitch.Label htmlFor="swich_plans_sc_1">
                    Plantea actividades congruentes para el cumplimiento de los objetivos de la
                    sesión de clase
                </FormSwitch.Label>
            </FormSwitch>

            <FormSwitch>
                <FormSwitch.Input name="swich_plans_sc_2" id="swich_plans_sc_2" type="checkbox"
                    v-model="form.swich_plans_sc_2" />
                <FormSwitch.Label htmlFor="swich_plans_sc_2">
                    Desarrolla el componente técnico deportivo del mes
                </FormSwitch.Label>
            </FormSwitch>

            <FormSwitch>
                <FormSwitch.Input name="swich_plans_sc_3" id="swich_plans_sc_3" type="checkbox"
                    v-model="form.swich_plans_sc_3" />
                <FormSwitch.Label htmlFor="swich_plans_sc_3">
                    Tiene buen manejo de grupo en el desarrollo de las actividades
                </FormSwitch.Label>
            </FormSwitch>

            <FormSwitch>
                <FormSwitch.Input name="swich_plans_sc_4" id="swich_plans_sc_4" type="checkbox"
                    v-model="form.swich_plans_sc_4" />
                <FormSwitch.Label htmlFor="swich_plans_sc_4">
                    Desarrolla el componente funcional del mes
                </FormSwitch.Label>
            </FormSwitch>
        </div>
    </div>
    <div class="w-full py-6 mx-auto">
        <h2 class="text-center mr-auto text-lg font-medium">Generalidades del monitor</h2>
    </div>
    <div class="p-5 intro-y box">
        <div class="grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
            <FormSwitch>
                <FormSwitch.Input name="swich_plans_gm_1" id="swich_plans_gm_1" type="checkbox"
                    v-model="form.swich_plans_gm_1" />
                <FormSwitch.Label htmlFor="swich_plans_gm_1"> Puntualidad </FormSwitch.Label>
            </FormSwitch>

            <FormSwitch>
                <FormSwitch.Input name="swich_plans_gm_2" id="swich_plans_gm_2" type="checkbox"
                    v-model="form.swich_plans_gm_2" />
                <FormSwitch.Label htmlFor="swich_plans_gm_2">
                    Presentacion personal - uniforme del Proyecto
                </FormSwitch.Label>
            </FormSwitch>

            <FormSwitch>
                <FormSwitch.Input name="swich_plans_gm_3" id="swich_plans_gm_3" type="checkbox"
                    v-model="form.swich_plans_gm_3" />
                <FormSwitch.Label htmlFor="swich_plans_gm_3"> Paciente </FormSwitch.Label>
            </FormSwitch>

            <FormSwitch>
                <FormSwitch.Input name="swich_plans_gm_4" id="swich_plans_gm_4" type="checkbox"
                    v-model="form.swich_plans_gm_4" />
                <FormSwitch.Label htmlFor="swich_plans_gm_4"> Disciplina </FormSwitch.Label>
            </FormSwitch>
            <FormSwitch>
                <FormSwitch.Input name="swich_plans_gm_5" id="swich_plans_gm_5" type="checkbox"
                    v-model="form.swich_plans_gm_5" />
                <FormSwitch.Label htmlFor="swich_plans_gm_5">
                    Comunicación alumnos y padres
                </FormSwitch.Label>
            </FormSwitch>
            <FormSwitch>
                <FormSwitch.Input name="swich_plans_gm_6" id="swich_plans_gm_6" type="checkbox"
                    v-model="form.swich_plans_gm_6" />
                <FormSwitch.Label htmlFor="swich_plans_gm_6">
                    Verbalización clara y simple
                </FormSwitch.Label>
            </FormSwitch>
        </div>
    </div>
    <div class="w-full py-6 mx-auto">
        <h2 class="text-center mr-auto text-lg font-medium">Modelo pedagógico del monitor</h2>
    </div>
    <div class="p-5 intro-y box">
        <div class="grid grid-cols-3 md:grid md:grid-cols-3 gap-6 justify-evenly">
            <FormSwitch>
                <FormSwitch.Input name="swich_plans_mp_1" id="swich_plans_mp_1" type="checkbox"
                    v-model="form.swich_plans_mp_1" />
                <FormSwitch.Label htmlFor="swich_plans_mp_1">
                    Modelo pedagógico del monitor
                </FormSwitch.Label>
            </FormSwitch>

            <FormSwitch>
                <FormSwitch.Input name="swich_plans_mp_2" id="swich_plans_mp_2" type="checkbox"
                    v-model="form.swich_plans_mp_2" />
                <FormSwitch.Label htmlFor="swich_plans_mp_2"> Conductual </FormSwitch.Label>
            </FormSwitch>

            <FormSwitch>
                <FormSwitch.Input name="swich_plans_mp_3" id="swich_plans_mp_3" type="checkbox"
                    v-model="form.swich_plans_mp_3" />
                <FormSwitch.Label htmlFor="swich_plans_mp_3"> Romantico </FormSwitch.Label>
            </FormSwitch>

            <FormSwitch>
                <FormSwitch.Input name="swich_plans_mp_4" id="swich_plans_mp_4" type="checkbox"
                    v-model="form.swich_plans_mp_4" />
                <FormSwitch.Label htmlFor="swich_plans_mp_4"> Constructivista </FormSwitch.Label>
            </FormSwitch>

            <FormSwitch>
                <FormSwitch.Input name="swich_plans_mp_5" id="swich_plans_mp_5" type="checkbox"
                    v-model="form.swich_plans_mp_5" />
                <FormSwitch.Label htmlFor="swich_plans_mp_5">
                    Integrador – globalizador
                </FormSwitch.Label>
            </FormSwitch>
        </div>
    </div>
    <div class="p-5 mt-6 intro-y box">
        <CommonTextarea label="Observaciones *" placeholder="Ingrese las observaciones" name="observations"
            v-model="form.observations" :validator="v$" />
    </div>
    <div class="p-5 mt-6 intro-y box">
        <CommonDropzone name="files" label="Archivos" :accept-multiple="true" v-model="form.files"
            @addfile="(error: any, value: filePondValue) => { form.files = multiple.addfile({ error, value }, form.files) as never[] }"
            @removefile="(error: any, value: filePondValue) => { form.files = multiple.removefile({ error, value }, form.files) as never[] }"
            :validator="v$" />
        <!-- <Dropzone refKey="dropzoneValidationRef" :options="{
            url: 'upload/methodologist_visits',
            thumbnailWidth: 150,
            maxFilesize: 0.5,
            maxFiles: 3,
            acceptedFiles: 'image/jpeg, image/png, image/jpg',
            headers: { 'My-Awesome-Header': 'header value' },
        }" class="dropzone">
            <div class="text-lg font-medium">Arrastra archivos aquí o haz clic para cargar.</div>
        </Dropzone> -->
    </div>
    <div class="mt-6 flex justify-end col-span-1 md:col-span-2">
        <Button variant="primary" class="btn btn-primary" @click="onSubmit">
            Registrar
        </Button>
    </div>
</template>
